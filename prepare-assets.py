from pathlib import Path
from PIL import Image
from collections import deque
import hashlib, json

root = Path(__file__).resolve().parent
out = root / 'assets'
out.mkdir(exist_ok=True)
hashes = ['09a43b734173','4eeae15d5a70','a07b75c0187a','14e2f9923d78','b80c28cbd0f2','4adc662c4619','42c6e19f21e0','ce54736d8e8d','64e577dfa30f','92ae501b39ad','fde636968fe4','dde3e9b50806']
sources = {}
for p in root.glob('*.jpeg'):
    h = hashlib.sha256(p.read_bytes()).hexdigest()[:12]
    if h in hashes: sources[hashes.index(h)+1] = p
specs = {
 'logo': (4, (718,331,883,458), 'gray'),
 'sakera': (10, (200,327,511,642), 'cream'),
 'marlena': (7, (158,451,389,681), 'cream'),
 'jokotole': (5, (41,181,638,701), None),
 'potre-koneng': (2, (813,206,1181,412), None),
 'ke-lesap': (2, (1208,206,1573,412), None),
 'art-jokotole': (2, (422,206,791,412), None),
 'art-craft': (2, (422,601,791,802), None),
 'art-karapan': (2, (813,601,1181,802), None),
 'art-batik': (2, (1208,601,1573,802), None),
 'odeng': (8, (121,575,224,693), None),
 'celurit': (8, (121,720,222,817), None)
}
manifest = {}
for name, (ref, box, mode) in specs.items():
    im = Image.open(sources[ref]).crop(box).convert('RGBA')
    if mode:
        px = im.load(); w,h = im.size; seen = set(); q=deque()
        def bg(x,y):
            r,g,b,a=px[x,y]
            return (max(r,g,b)-min(r,g,b)<30) if mode=='gray' else (r>203 and g>181 and b>145 and r-g<48)
        for x in range(w): q.extend(((x,0),(x,h-1)))
        for y in range(h): q.extend(((0,y),(w-1,y)))
        while q:
            x,y=q.popleft()
            if (x,y) in seen or not (0<=x<w and 0<=y<h): continue
            seen.add((x,y))
            if not bg(x,y): continue
            px[x,y]=(0,0,0,0)
            q.extend(((x-1,y),(x+1,y),(x,y-1),(x,y+1)))
    im.save(out / (name+'.png'))
    manifest[name]={'file':'assets/'+name+'.png','width':im.width,'height':im.height,'source':sources[ref].name,'reference':ref,'crop':box,'treatment':mode or 'original screenshot crop'}
    print(name, im.width, im.height)
(out/'provenance.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
