import glob, os, struct
from html.parser import HTMLParser

def get_image_size(file_path):
    if not os.path.exists(file_path):
        return None, None
    with open(file_path, 'rb') as f:
        data = f.read(30)
        if data.startswith(b'\x89PNG\r\n\x1a\n'):
            w, h = struct.unpack('>LL', data[16:24])
            return w, h
        f.seek(0)
        b = f.read()
        if b[:2] == b'\xff\xd8':
            i = 2
            while i < len(b):
                marker, length = struct.unpack('>2sH', b[i:i+4])
                i += 4
                if marker in (b'\xff\xc0', b'\xff\xc2'):
                    h, w = struct.unpack('>HH', b[i+1:i+5])
                    return w, h
                i += length - 2
    return None, None

class DetailParser(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.stack = []
        self.items = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        self.stack.append((tag, d))
        if tag == 'img':
            parent_classes = [a.get('class', '') for t, a in self.stack[:-1] if a.get('class')]
            self.items.append((self.getpos()[0], d, parent_classes))
    def handle_endtag(self, tag):
        if self.stack: self.stack.pop()

for f in sorted(glob.glob('treatments/*.html')):
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    p = DetailParser(f)
    p.feed(c)
    print(f'=== {f} ({len(p.items)} images) ===')
    for line, attrs, parents in p.items:
        src = attrs.get('src', '')
        actual = os.path.normpath(os.path.join(os.path.dirname(f), src))
        w, h = get_image_size(actual)
        alt_text = attrs.get('alt', '')
        has_alt = 'alt' in attrs
        parent_cls = parents[-1] if parents else ''
        print(f"  L{line:3d} | src: {src} | real: {w}x{h} | parent: {parent_cls} | alt_present: {has_alt} ('{alt_text[:40]}') | w_attr: {attrs.get('width')} | h_attr: {attrs.get('height')}")
