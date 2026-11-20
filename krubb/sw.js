/* KRUBB × ThB.Ho PWA service worker
   Page (HTML): network first, so updates show right away; cached copy only when offline.
   Images: cache first (file names carry ?v= when they change).
   Video: not cached (large, uses range requests). */
const V = 'krubb-v1';
const SHELL = ['./', './manifest.webmanifest', './media/icon-192.png', './media/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || !u.pathname.startsWith('/krubb/')) return;
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return;
  if (r.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html')) {
    e.respondWith(fetch(r).then(res => {
      const cp = res.clone(); caches.open(V).then(c => c.put('./', cp)); return res;
    }).catch(() => caches.match('./')));
    return;
  }
  if (/\.(jpg|jpeg|png|webp|svg)$/i.test(u.pathname)) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
      return res;
    })));
  }
});
