#!/usr/bin/env python3
"""Add X *video* posts to the ThB.Ho portfolio (ThBHoPortfolio.html FILMS list + x-media.js).

usage (from the repo root):
  python3 -I tools/add_x_post.py [--dry] [--account threeandhour] <id|url> [...]

  --dry        print what would be added, change nothing
  --account    X account the post is on (default widerooms). Posts from
               @threeandhour get u:'threeandhour' so the card links there.

Metadata comes from api.fxtwitter.com. Ids already listed are skipped (house rule:
never add a clip twice). Category and personas are guesses from the post text:
always check them against the house rules in CLAUDE.md, and the personas by face.
"""
import json, re, subprocess, sys, datetime

P = 'ThBHoPortfolio.html'; MJ = 'x-media.js'
args = sys.argv[1:]
dry = '--dry' in args
account = 'widerooms'
if '--account' in args:
    account = args[args.index('--account') + 1]
    args = [a for a in args if a != account]
ids = [a for a in args if not a.startswith('--')]

s = open(P, encoding='utf8').read()
media = json.loads(open(MJ, encoding='utf8').read().split('=', 1)[1].strip().rstrip(';'))

def kview(v): return '' if not v else (f'{v/1000:.1f}K' if v < 10000 else f'{round(v/1000)}K')
def dur(sec): sec = int(round(sec or 0)); return f'{sec//60}:{sec%60:02d}' if sec else ''

def personas(text):
    t = text.lower(); p = []
    if '#threebhour' in t or '#thbho' in t or 'th | b. | ho' in t: return ['three', 'b', 'hour']
    if 'three' in t.replace('threeandhour', '') or '#infp' in t or '@threebesthours' in t: p.append('three')
    if re.search(r'\bb\.\s', text) or 'covered by b.' in t or '#infj' in t: p.append('b')
    if 'hour' in t.replace('threeandhour', '') or '@hunkthbho' in t or '#estp' in t: p.append('hour')
    return p

def cat(text, seconds):
    t = text.lower()
    if seconds > 150: return 'mv'                       # longer than 2:30 = MV
    if 'portfolio vol' in t: return 'bts'               # "Portfolio Vol." = behind the scenes
    if 'bts' in t or 'behind' in t or 'casting' in t or 'working on it' in t: return 'bts'
    if '(mv)' in t or 'full mv' in t or 'official mv' in t or 'new mv' in t or t.startswith('mv'): return 'mv'
    return 'film'

def wh(url):
    m = re.search(r'/(\d+)x(\d+)/', url)
    return max(int(m.group(1)), int(m.group(2))) if m else 0

added = []
for i in ids:
    i = re.sub(r'\D', '', i.split('status/')[-1]) if 'status/' in i else i
    if f"id:'{i}'" in s:
        m = re.search(r"id:'" + i + r"',cat:'([a-z]*)',t:'((?:[^'\\]|\\.)*)'", s)
        print(i, 'already listed:', m.groups() if m else ''); continue
    r = subprocess.run(['curl', '-sS', '-m', '25', f'https://api.fxtwitter.com/{account}/status/{i}'],
                       capture_output=True, text=True)
    try: d = json.loads(r.stdout)
    except Exception: print(i, 'bad response'); continue
    t = d.get('tweet') or {}
    v = ((t.get('media') or {}).get('videos') or [None])[0]
    if not v: print(i, 'no video (code %s)' % d.get('code')); continue
    vs = sorted([x for x in v.get('variants', []) if x.get('content_type') == 'video/mp4'], key=lambda x: x.get('bitrate', 0))
    pick = [x for x in vs if (x.get('bitrate') or 0) <= 2600000]          # ~720p for normal play
    mp4 = (pick[-1] if pick else vs[0])['url']
    hd = [x for x in vs if 1280 < wh(x['url']) <= 1920]                   # 1080p, used in full screen
    text = t.get('text', ''); first = next((l.strip() for l in text.split('\n') if l.strip()), '')
    title = re.sub(r'https?://\S+', '', re.sub(r'\s*#\w+', '', first)).strip(' "“”').strip() or f'@{account} video'
    title = title[:70].replace("'", "\\'")
    ts = t['created_timestamp']; dt = datetime.datetime.fromtimestamp(ts, datetime.UTC)
    extra = ",u:'threeandhour'" if account == 'threeandhour' else ''
    row = (f"  {{id:'{i}',cat:'{cat(text, v.get('duration') or 0)}',t:'{title}',p:{json.dumps(personas(text)).replace(' ', '')},"
           f"y:{dt.year},d:'{dt.strftime('%-d %b %Y')}',v:'{kview(t.get('views'))}',vn:{t.get('views') or 0},"
           f"ln:{t.get('likes') or 0},ts:{ts},dur:'{dur(v.get('duration'))}'{extra}}},\n")
    print(('DRY ' if dry else 'added ') + row.strip(), '| text:', text[:90].replace('\n', ' / '))
    if dry: continue
    s = s.replace(' var FILMS=[\n', ' var FILMS=[\n' + row, 1)
    media[i] = {'mp4': mp4, 'poster': v.get('thumbnail_url'), 'w': v.get('width'), 'h': v.get('height')}
    if hd and max(hd, key=lambda x: x.get('bitrate', 0))['url'] != mp4:
        media[i]['hd'] = max(hd, key=lambda x: x.get('bitrate', 0))['url']
    added.append(i)

if added:
    open(P, 'w', encoding='utf8').write(s)
    open(MJ, 'w', encoding='utf8').write('// Direct media for @widerooms posts (from X). id -> {mp4 (720p), poster, w, h, hd (1080p for full screen)}\n'
                                         'window.THBHO_X=' + json.dumps(media, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('entries now', s.count("  {id:'"), '| added', len(added))
