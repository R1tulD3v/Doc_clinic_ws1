import glob, os, re, json
from html.parser import HTMLParser

all_html = sorted(glob.glob('*.html')) + sorted(glob.glob('treatments/*.html'))

# 1. "Implantologist"
implantologist_report = {}

# 2. "painless", "pain-free", "cure", "best", "guarantee"
claim_words = ['painless', 'pain-free', 'cure', 'best', 'guarantee']
claim_pattern = re.compile(r'\b(painless|pain-free|cure|best|guarantee[s|d|ing]?)\b', re.IGNORECASE)
claims_report = {}

# 3. Canonical, og:url, JSON-LD urls, sitemap URLs
urls_report = {}

# 4. "Khagaria" count in visible text
class VisibleTextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.ignore = False
    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style', 'noscript']:
            self.ignore = True
    def handle_endtag(self, tag):
        if tag in ['script', 'style', 'noscript']:
            self.ignore = False
    def handle_data(self, data):
        if not self.ignore:
            self.text_parts.append(data)

khagaria_counts = {}

def get_sentences(text):
    # Split text into sentences or lines
    lines = text.splitlines()
    sentences = []
    for l in lines:
        l = l.strip()
        if not l: continue
        sentences.append(l)
    return sentences

for f in all_html:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # 1. Implantologist matches with sentence
    imp_matches = []
    for idx, line in enumerate(content.splitlines()):
        if re.search(r'Implantologist', line, re.IGNORECASE):
            # clean tag to get sentence or keep raw
            imp_matches.append((idx + 1, line.strip()))
    if imp_matches:
        implantologist_report[f] = imp_matches

    # 2. Claim words
    c_matches = []
    for idx, line in enumerate(content.splitlines()):
        # ignore script tags or style tags
        m = claim_pattern.search(line)
        if m:
            c_matches.append((idx + 1, m.group(0), line.strip()))
    if c_matches:
        claims_report[f] = c_matches

    # 3. URLs
    canon = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', content, re.I)
    og_url = re.search(r'<meta[^>]*property=["\']og:url["\'][^>]*content=["\'](.*?)["\']', content, re.I)
    json_ld_urls = re.findall(r'"url"\s*:\s*"([^"]+)"', content)
    
    urls_report[f] = {
        'canonical': canon.group(1) if canon else 'None',
        'og_url': og_url.group(1) if og_url else 'None',
        'json_ld_urls': list(set(json_ld_urls))
    }

    # 4. Khagaria visible text count
    parser = VisibleTextParser()
    parser.feed(content)
    visible_text = ' '.join(parser.text_parts)
    # Count whole word or case insensitive Khagaria
    k_count = len(re.findall(r'\bKhagaria\b', visible_text, re.IGNORECASE))
    khagaria_counts[f] = k_count

# Read sitemap.xml
sitemap_urls = []
if os.path.exists('sitemap.xml'):
    with open('sitemap.xml', 'r', encoding='utf-8') as fp:
        sm = fp.read()
    sitemap_urls = re.findall(r'<loc>(.*?)</loc>', sm)

# Also check JS files for claims or implantologist
js_files = ['js/clinic-data.js', 'js/main.js', 'js/i18n.js', 'js/layout.js']
js_implantologist = {}
js_claims = {}
for jf in js_files:
    if os.path.exists(jf):
        with open(jf, 'r', encoding='utf-8') as fp:
            jc = fp.read()
        j_imp = []
        j_cl = []
        for idx, line in enumerate(jc.splitlines()):
            if re.search(r'Implantologist', line, re.IGNORECASE):
                j_imp.append((idx + 1, line.strip()))
            m = claim_pattern.search(line)
            if m:
                j_cl.append((idx + 1, m.group(0), line.strip()))
        if j_imp: js_implantologist[jf] = j_imp
        if j_cl: js_claims[jf] = j_cl

out_data = {
    'implantologist_html': implantologist_report,
    'implantologist_js': js_implantologist,
    'claims_html': claims_report,
    'claims_js': js_claims,
    'urls': urls_report,
    'sitemap': sitemap_urls,
    'khagaria_counts': khagaria_counts
}

with open('scratch/part4_results.json', 'w', encoding='utf-8') as fp:
    json.dump(out_data, fp, indent=2)

print("Part 4 analysis complete.")
