"""Estudio de optimizacion de fuentes (F1). NO forma parte del build ni de las dependencias del proyecto.

Requiere un entorno temporal:
    python -m venv /tmp/v && /tmp/v/bin/pip install fonttools==4.55.3 brotli
IBM Plex Mono declara el nombre reservado Plex: no se modifica. Resultados en ../fonts-register.md.
"""
import io, os, re, sys, glob
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
SRC = os.path.join(ROOT, 'src', 'assets', 'fonts')
OUT = os.path.join(os.path.dirname(__file__), '_out')  # temporal; no se versiona
os.makedirs(OUT, exist_ok=True)

# Caracteres realmente usados por el sitio (fuera de comentarios) + ASCII + Latin-1 letras y signos del español/inglés
def strip(src):
    src = re.sub(r'/\*[\s\S]*?\*/', '', src)
    return re.sub(r'(^|[^:\\\'"`])//.*$', r'\1', src, flags=re.M)
used = set(range(0x20, 0x7f))
for f in glob.glob(os.path.join(ROOT, 'src', '**', '*'), recursive=True):
    if os.path.isfile(f) and re.search(r'\.(js|jsx|css)$', f) and not f.endswith('.test.js'):
        used |= {ord(c) for c in strip(open(f, encoding='utf-8').read())}
used |= set(range(0xa0, 0x100))   # Latin-1 completo: nombres propios y citas
used |= {0x2018, 0x2019, 0x201c, 0x201d, 0x2013, 0x2014, 0x2026, 0x2022, 0x2212, 0x20ac, 0x2122}
used = {c for c in used if c < 0x3000}
print('code points a conservar:', len(used))

def size_woff2(font):
    buf = io.BytesIO(); font.flavor = 'woff2'; font.save(buf); return len(buf.getvalue()), buf.getvalue()

def run(name, path, *, features, limits=None):
    f = TTFont(path)
    opts = subset.Options(); opts.layout_features = features; opts.glyph_names = False; opts.notdef_outline = True
    opts.name_IDs = [1, 2, 3, 4, 6]; opts.hinting = False; opts.desubroutinize = False; opts.flavor = 'woff2'
    s = subset.Subsetter(opts); s.populate(unicodes=sorted(used)); s.subset(f)
    if limits:
        f = instancer.instantiateVariableFont(f, limits, inplace=False)
    n, data = size_woff2(f)
    open(os.path.join(OUT, name + '.woff2'), 'wb').write(data)
    print(f'{name:48} {n:>7} bytes')
    return n

KERN = ['kern', 'liga', 'ccmp', 'locl', 'mark', 'mkmk']
for fid, fn in [('fraunces-normal', 'fraunces-latin-normal.woff2'), ('fraunces-italic', 'fraunces-latin-italic.woff2'), ('instrument-sans', 'instrument-sans-latin-normal.woff2')]:
    p = os.path.join(SRC, fn)
    print('==', fid, 'original', os.path.getsize(p))
    run(fid + '--subset-features', p, features=KERN)
    if fid.startswith('fraunces'):
        run(fid + '--subset+opsz24-144', p, features=KERN, limits={'opsz': (24, 144)})
        run(fid + '--subset+opsz36-144', p, features=KERN, limits={'opsz': (36, 144)})
        run(fid + '--subset+opsz24-144+wght300-400', p, features=KERN, limits={'opsz': (24, 144), 'wght': (300, 400)})
        run(fid + '--subset+opsz72-144+wght300-500', p, features=KERN, limits={'opsz': (72, 144)})
        run(fid + '--subset+opsz144-pinned', p, features=KERN, limits={'opsz': 144})
        run(fid + '--subset+opsz48-pinned', p, features=KERN, limits={'opsz': 48})
    else:
        run(fid + '--subset+wght400-600', p, features=KERN, limits={'wght': (400, 600)})
