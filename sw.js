// Enkel offline-støtte: henter alltid nyeste versjon når du er på nett, ellers lagret kopi.
const C = "squishy-v9";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const same = new URL(e.request.url).origin === location.origin;
  e.respondWith(fetch(e.request, same ? {cache: "no-cache"} : undefined).then(r => { const copy = r.clone(); if (r.ok) caches.open(C).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});
