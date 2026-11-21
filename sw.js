/* creators.thbho.com service worker · copied from thbho.com/hai-sw.js (Hybrid AI shared SW) 21 Nov 2026 · used by the KRUBB app (/krubb/pwa.js)
   - pages (HTML): network first, cached copy when offline or the signal is weak
   - data (json, csv, Sheet), no-cache requests and js/css without ?v=: network first, cache only as fallback
   - versioned js/css (?v=) and images: cached copy at once, refreshed in the background
   - other sites (media.thbho.com, Google, maps, fonts CDN): untouched, the browser handles them
   Bump VERSION to drop old caches. */
const VERSION = "krubb-v1";
const PAGES = VERSION + "-pages", FILES = VERSION + "-files", MAX_FILES = 300;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (!k.startsWith(VERSION)) await caches.delete(k);
  await self.clients.claim();
})()));

async function trim(name) {
  const c = await caches.open(name), keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_FILES; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  // video/audio: never cached here (big files, Range requests; iPhone needs real 206 answers from the server)
  if (/\.(mp4|m4v|webm|mov|mp3|m4a)$/i.test(u.pathname) || r.headers.has("range")) return;
  const page = r.mode === "navigate" || (r.headers.get("accept") || "").includes("text/html");
  // data and unversioned code always come fresh (prices and status must never be stale); the cache is only a fallback
  const fresh = page || r.cache !== "default" || /\.(json|csv|webmanifest)$/i.test(u.pathname) ||
    (/\.(js|css)$/i.test(u.pathname) && !u.searchParams.has("v"));
  if (fresh) {
    e.respondWith((async () => {
      const name = page ? PAGES : FILES, key = page ? u.origin + u.pathname : r;   // one copy per page, query ignored
      try {
        const res = await fetch(r);
        if (res.ok && res.type === "basic") (await caches.open(name)).put(key, res.clone());
        return res;
      } catch (err) {
        return (await caches.match(key, { ignoreSearch: page })) || Response.error();
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const c = await caches.open(FILES), hit = await c.match(r);
    const net = fetch(r).then(res => { if (res.ok && res.type === "basic") { c.put(r, res.clone()); trim(FILES); } return res; }).catch(() => hit);
    return hit || net;
  })());
});
