#!/usr/bin/env python3
"""Refresh X view/like counts for every post listed in ThBHoPortfolio.html.
Reads each {id:'…', … v:'…', vn:…, (ln:…)} row, asks api.fxtwitter.com for current numbers,
rewrites the row and the <time id="asof"> date. Exit 0 always; prints a summary. Run from repo root."""
import json, re, sys, time, datetime, urllib.request
P = 'ThBHoPortfolio.html'
s = open(P, encoding='utf8').read()
rows = re.findall(r"\{id:'(\d+)',cat:'\w+',t:'(?:[^'\\]|\\.)*',p:\[[^\]]*\],y:\d+,d:'[^']*',v:'[^']*',vn:\d+(?:,ln:\d+)?,ts:\d+", s)
def kview(v): return '' if not v else (f'{v/1000:.1f}K' if v < 10000 else f'{round(v/1000)}K')
def fetch(i):
    for attempt in range(3):
        try:
            req = urllib.request.Request(f'https://api.fxtwitter.com/widerooms/status/{i}', headers={'User-Agent': 'ThBHo-portfolio-refresh/1.0 (github action)'})
            with urllib.request.urlopen(req, timeout=25) as r: d = json.load(r)
            t = d.get('tweet') or {}
            if d.get('code') == 200 and t: return t.get('views'), t.get('likes')
            if d.get('code') == 404: return None
        except Exception as e: err = e
        time.sleep(3 * (attempt + 1))
    return None
changed = missing = 0
for i in rows:
    r = fetch(i); time.sleep(0.6)
    if not r: missing += 1; print('skip', i); continue
    views, likes = r
    def fix(m):
        global changed
        row = m.group(0)
        new = re.sub(r"v:'[^']*',vn:\d+", f"v:'{kview(views)}',vn:{views or 0}", row) if views else row
        if 'ln:' in new and likes is not None: new = re.sub(r"ln:\d+", f"ln:{likes}", new)
        if new != row: changed += 1
        return new
    s = re.sub(r"\{id:'" + i + r"',[^}]*\}", fix, s, count=1)
if changed:
    today = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).strftime('%-d %b %Y')
    s = re.sub(r'<time id="asof">[^<]*</time>', f'<time id="asof">{today}</time>', s)
    open(P, 'w', encoding='utf8').write(s)
print(f'rows {len(rows)} changed {changed} unavailable {missing}')
