// Weekly X view/like stats from the daily refresh commits (thbho-bot) on origin/main.
// Usage (repo root):  git fetch --depth 400 origin +main:refs/remotes/origin/main  &&  node tools/weekly_stats.js [days=7]
// Prints JSON: totals, daily like-for-like gains, top movers, new clips, persona totals, all-time top.
const { execSync } = require('child_process');
const days = +(process.argv[2] || 7);
const sh = c => execSync(c, { maxBuffer: 1e9 }).toString();
const log = sh("git log origin/main --author=thbho-bot --format='%h|%s'").trim().split('\n')
  .map(l => { const [h, s] = l.split('|'); const m = s.match(/\((\d{4}-\d\d-\d\d)\)/); return m && { h, d: m[1] }; })
  .filter(Boolean);
const byDay = {}; for (const c of log) if (!byDay[c.d]) byDay[c.d] = c.h; // newest commit per day
const dates = Object.keys(byDay).sort();
const end = dates.at(-1);
const startTarget = new Date(Date.parse(end) - days * 864e5).toISOString().slice(0, 10);
const span = dates.filter(d => d >= startTarget);
function load(h) {
  const s = sh('git show ' + h + ':ThBHoPortfolio.html');
  const m = s.match(/ var FILMS=\[[\s\S]*?\n \];/); let FILMS; eval('FILMS' + m[0].trim().slice(9));
  const o = {}; for (const f of FILMS) if (!f.yt && f.cat !== 'photo') o[f.id] = f; return o;
}
const S = span.map(d => [d, load(byDay[d])]);
const first = S[0][1], last = S.at(-1)[1];
const sum = (o, k) => Object.values(o).reduce((a, f) => a + (f[k] || 0), 0);
const daily = [];
for (let i = 1; i < S.length; i++) {
  const a = S[i - 1][1], b = S[i][1]; let dv = 0, dl = 0, grow = 0, n = 0;
  for (const id in b) if (a[id]) { n++; dv += b[id].vn - a[id].vn; if (a[id].ln) dl += (b[id].ln || 0) - a[id].ln; if (b[id].vn > a[id].vn) grow++; }
  daily.push({ day: S[i][0], views: dv, likes: dl, clips: n, growing: grow });
}
const movers = [];
for (const id in last) if (first[id]) {
  const f = last[id], p = first[id];
  movers.push({ title: f.t, id, posted: f.d, views: f.vn, likes: f.ln || 0, dViews: f.vn - p.vn, dLikes: p.ln ? (f.ln || 0) - p.ln : null, pct: p.vn ? +(100 * (f.vn - p.vn) / p.vn).toFixed(1) : null });
}
movers.sort((x, y) => y.dViews - x.dViews);
const persona = {};
for (const f of Object.values(last)) for (const k of f.p) { persona[k] = persona[k] || { views: 0, gain: 0 }; persona[k].views += f.vn; if (first[f.id]) persona[k].gain += f.vn - first[f.id].vn; }
console.log(JSON.stringify({
  from: span[0], to: end, clips: Object.keys(last).length,
  totals: { views: sum(last, 'vn'), likes: sum(last, 'ln') },
  gainLikeForLike: movers.reduce((a, r) => a + r.dViews, 0), clipsCompared: movers.length, clipsGrowing: movers.filter(r => r.dViews > 0).length,
  daily, topViews: movers.slice(0, 8),
  topPct: movers.filter(r => r.views - r.dViews >= 500).sort((x, y) => y.pct - x.pct).slice(0, 5),
  topLikes: movers.filter(r => r.dLikes !== null).sort((x, y) => y.dLikes - x.dLikes).slice(0, 5),
  likesDown: movers.filter(r => r.dLikes < 0).map(r => ({ title: r.title, dLikes: r.dLikes })),
  newClips: Object.values(last).filter(f => !first[f.id]).map(f => ({ title: f.t, posted: f.d, views: f.vn, likes: f.ln || 0 })),
  removedClips: Object.values(first).filter(f => !last[f.id]).map(f => f.t),
  persona,
  allTimeTop: Object.values(last).sort((a, b) => b.vn - a.vn).slice(0, 5).map(f => ({ title: f.t, views: f.vn, likes: f.ln || 0 })),
}, null, 1));
