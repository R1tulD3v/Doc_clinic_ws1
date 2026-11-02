import glob, os, re

files = [
    'contact.html',
    'treatments/ceramic-crown-and-bridge.html',
    'treatments/childrens-dentistry.html',
    'treatments/complete-denture.html',
    'treatments/dental-implants.html',
    'treatments/filling-of-decayed-teeth.html',
    'treatments/oral-lesions-diagnosis.html',
    'treatments/orthodontics.html',
    'treatments/periodontal-flap-surgery.html',
    'treatments/root-canal-treatment.html',
    'treatments/teeth-cleaning-scaling.html',
    'treatments/teeth-whitening.html'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    title = re.search(r'<title>(.*?)</title>', c, re.DOTALL)
    meta = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', c, re.DOTALL)
    og_title = re.search(r'<meta[^>]*property=["\']og:title["\'][^>]*content=["\'](.*?)["\']', c, re.DOTALL)
    og_desc = re.search(r'<meta[^>]*property=["\']og:description["\'][^>]*content=["\'](.*?)["\']', c, re.DOTALL)
    tw_title = re.search(r'<meta[^>]*name=["\']twitter:title["\'][^>]*content=["\'](.*?)["\']', c, re.DOTALL)
    tw_desc = re.search(r'<meta[^>]*name=["\']twitter:description["\'][^>]*content=["\'](.*?)["\']', c, re.DOTALL)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', c, re.DOTALL)
    print(f'=== {f} ===')
    print('Title:', title.group(1).strip() if title else 'NONE')
    print('OG Title:', og_title.group(1).strip() if og_title else 'NONE')
    print('TW Title:', tw_title.group(1).strip() if tw_title else 'NONE')
    print('Meta desc:', meta.group(1).strip() if meta else 'NONE')
    print('OG desc:', og_desc.group(1).strip() if og_desc else 'NONE')
    print('TW desc:', tw_desc.group(1).strip() if tw_desc else 'NONE')
    if h1:
        print('H1:', h1.group(0).strip())
