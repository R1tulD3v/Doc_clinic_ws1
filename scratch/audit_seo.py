import glob, os, re, json

files = ['index.html', 'doctor.html', 'contact.html'] + sorted(glob.glob('treatments/*.html'))

results = []

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    # Title
    m_title = re.search(r'<title>(.*?)</title>', c, re.DOTALL | re.IGNORECASE)
    title_text = m_title.group(1).strip() if m_title else ''
    
    # Meta description
    m_meta = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', c, re.DOTALL | re.IGNORECASE)
    if not m_meta:
        m_meta = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', c, re.DOTALL | re.IGNORECASE)
    meta_text = m_meta.group(1).strip() if m_meta else ''
    
    # H1
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', c, re.DOTALL | re.IGNORECASE)
    h1_cleaned = []
    for h in h1s:
        # If there are lang-en spans or similar, extract the visible English text cleanly
        if 'lang-en' in h:
            m_en = re.search(r'<span\s+class=["\']lang-en["\']>(.*?)</span>', h, re.DOTALL)
            if m_en:
                h = m_en.group(1)
        txt = re.sub(r'<[^>]+>', '', h)
        txt = re.sub(r'\s+', ' ', txt).strip()
        h1_cleaned.append(txt)
    
    # Canonical
    m_canon = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', c, re.IGNORECASE)
    if not m_canon:
        m_canon = re.search(r'<link\s+href=["\'](.*?)["\']\s+rel=["\']canonical["\']', c, re.IGNORECASE)
    has_canonical = 'Yes' if m_canon else 'No'
    
    # JSON-LD
    json_lds = re.findall(r'<script\s+type=["\']application/ld\+json["\']>(.*?)</script>', c, re.DOTALL | re.IGNORECASE)
    schema_types = []
    for j in json_lds:
        types = re.findall(r'"@type"\s*:\s*"([^"]+)"', j)
        schema_types.extend(types)
    schema_str = ', '.join(schema_types) if schema_types else 'No'
    
    # Check for 'Oral Implantologist' or 'Implantologist'
    matches_implant = []
    for line_idx, line in enumerate(c.splitlines()):
        if re.search(r'Implantologist', line, re.IGNORECASE):
            matches_implant.append((line_idx + 1, line.strip()))
    
    results.append({
        'page': f.replace('\\', '/'),
        'title': title_text,
        'title_len': len(title_text),
        'meta': meta_text,
        'meta_len': len(meta_text),
        'h1_count': len(h1s),
        'h1_text': '; '.join(h1_cleaned),
        'canonical': has_canonical,
        'schema': schema_str,
        'implantologist_matches': matches_implant
    })

with open('scratch/audit_results.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, indent=2)

print(f"Audited {len(results)} pages successfully.")
