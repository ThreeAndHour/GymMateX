#!/usr/bin/env python3
"""Refresh X like counts for every Krubb card that comes from an X post.
Reads each {id:"…", … x:"https://x.com/<user>/status/<id>", … v:N …} row in krubb/index.html,
asks api.fxtwitter.com for the current likes and rewrites v:N (the ♥ number on the card).
Exit 0 always; prints a summary. Run from repo root (same daily job as refresh_views.py)."""
import json, re, time, urllib.request
P = 'krubb/index.html'
s = open(P, encoding='utf8').read()
ROW = re.compile(r'\{id:"[^"]+"[^{}]*?x:"https://x\.com/(\w+)/status/(\d+)"[^{}]*\}')
def fetch(user, i):
    for attempt in range(3):
        try:
            req = urllib.request.Request(f'https://api.fxtwitter.com/{user}/status/{i}', headers={'User-Agent': 'ThBHo-krubb-refresh/1.0 (github action)'})
            with urllib.request.urlopen(req, timeout=25) as r: d = json.load(r)
            t = d.get('tweet') or {}
            if d.get('code') == 200 and t: return t.get('likes')
            if d.get('code') == 404: return None
        except Exception: pass
        time.sleep(3 * (attempt + 1))
    return None
likes = {}
for user, i in sorted({(m.group(1), m.group(2)) for m in ROW.finditer(s)}):
    n = fetch(user, i); time.sleep(0.6)
    if n is None: print('skip', user, i)
    else: likes[i] = n
changed = 0
def fix(m):
    global changed
    row, i = m.group(0), m.group(2)
    if i not in likes: return row
    new = re.sub(r'(?<=[,{])v:\d+', f'v:{likes[i]}', row, count=1)
    if new != row: changed += 1
    return new
s = ROW.sub(fix, s)
if changed: open(P, 'w', encoding='utf8').write(s)
print(f'krubb rows {len(likes)} fetched, changed {changed}')
