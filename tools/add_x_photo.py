#!/usr/bin/env python3
"""Add @widerooms X *photo* posts to the ThB.Ho portfolio from fxtwitter metadata.
usage (from the repo root): python3 -I tools/add_x_photo.py [--dry] <id|url> [...]
--dry only prints metadata (views, likes, photos, personas) without writing.
Skips ids already present or without photos. Personas come from hashtags/text; verify by face afterwards."""
import json, re, subprocess, sys, datetime
P = 'ThBHoPortfolio.html'
dry = '--dry' in sys.argv
ids = [a for a in sys.argv[1:] if a != '--dry']
s = open(P, encoding='utf8').read()
def kview(v): return '' if not v else (f'{v/1000:.1f}K' if v < 10000 else f'{round(v/1000)}K')
def personas(text):
    t = text.lower(); p = []
    if '#threebhour' in t or '#thbho' in t or 'th | b. | ho' in t: return ['three', 'b', 'hour']
    if 'by three' in t or '#infp' in t or '@threebesthours' in t or 'feat. three' in t: p.append('three')
    if re.search(r'\bby b\.', t) or '#infj' in t or 'feat. b.' in t: p.append('b')
    if 'by hour' in t or '#estp' in t or '@hunkthbho' in t or 'feat. hour' in t: p.append('hour')
    if '#threeandhour' in t and not p: p = ['three', 'hour']
    return p
added = []
for i in ids:
    i = re.sub(r'\D', '', i.split('status/')[-1]) if 'status/' in i else i
    if f"id:'{i}'" in s: print(i, 'already listed'); continue
    r = subprocess.run(['curl', '-sS', '-m', '25', f'https://api.fxtwitter.com/widerooms/status/{i}'], capture_output=True, text=True)
    try: d = json.loads(r.stdout)
    except Exception: print(i, 'bad response'); continue
    t = d.get('tweet') or {}
    ph = (t.get('media') or {}).get('photos') or []
    if not ph: print(i, 'no photos (code %s)' % d.get('code')); continue
    text = t.get('text', ''); first = next((l.strip() for l in text.split('\n') if l.strip()), '')
    title = re.sub(r'https?://\S+', '', re.sub(r'\s*#\w+', '', first)).strip(' "“”').strip() or 'Photo'
    title = title[:70].replace("'", "\\'")
    ts = t['created_timestamp']; dt = datetime.datetime.fromtimestamp(ts, datetime.UTC)
    imgs = [re.sub(r'\?.*$', '', x['url']) for x in ph]
    row = (f"  {{id:'{i}',cat:'photo',t:'{title}',p:{json.dumps(personas(text)).replace(' ', '')},y:{dt.year},"
           f"d:'{dt.strftime('%-d %b %Y')}',v:'{kview(t.get('views'))}',vn:{t.get('views') or 0},ln:{t.get('likes') or 0},ts:{ts},"
           f"img:{json.dumps(imgs).replace(' ', '')}}},\n")
    print(('DRY ' if dry else 'added ') + row.strip(), '| likes', t.get('likes'), 'views', t.get('views'), '| text:', text[:80].replace('\n', ' / '))
    if dry: continue
    s = s.replace(' var FILMS=[\n', ' var FILMS=[\n' + row, 1); added.append(i)
if added: open(P, 'w', encoding='utf8').write(s)
print('photo entries now', s.count("cat:'photo'"))
