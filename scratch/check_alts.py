import glob, os, re
from html.parser import HTMLParser

class AltChecker(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.missing = []
        self.empty = []
        self.present = []
    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            d = dict(attrs)
            line = self.getpos()[0]
            src = d.get('src', '')
            if 'alt' not in d:
                self.missing.append((line, src))
            elif d['alt'].strip() == '':
                self.empty.append((line, src))
            else:
                self.present.append((line, src, d['alt']))

files = ['index.html', 'doctor.html', 'contact.html'] + sorted(glob.glob('treatments/*.html'))
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    p = AltChecker(f)
    p.feed(c)
    if p.missing:
        print(f'{f}: {len(p.missing)} MISSING alt attribute:')
        for line, src in p.missing:
            print(f'   L{line}: src="{src}"')
    else:
        print(f'{f}: No missing alt attributes (all have alt). ({len(p.empty)} empty alt="", {len(p.present)} descriptive alt)')
    if p.empty:
        for line, src in p.empty:
            print(f'   empty alt="" at L{line}: {src}')

print("\n--- Checking JS Templates ---")
for js in ['js/layout.js', 'js/main.js']:
    with open(js, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    for i, l in enumerate(lines):
        if '<img' in l:
            has_alt = 'alt=' in l
            print(f'{js}:L{i+1} has_alt={has_alt} -> {l.strip()[:100]}')
