const CACHE_NAME = "gps-app-v2";

const FILES = [

  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {

  self.skipWaiting();

  e.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("activate", (e) => {

  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request)
    .then(response => response || fetch(e.request))
  );
});