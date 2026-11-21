/* Retired 21 Nov 2026: the KRUBB app now uses the site service worker /sw.js (scope "/").
   Phones that installed this older one remove it here and drop its cache. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  await caches.delete("krubb-v1");
  await self.registration.unregister();
  for (const c of await self.clients.matchAll({ type: "window" })) c.navigate(c.url);
})()));
