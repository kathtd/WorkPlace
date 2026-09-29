const CACHE_NAME = "workplace-v2";
const FILES = [
  "/WorkPlace/",
  "/WorkPlace/index.html",
  "/WorkPlace/manifest.json",
  "/WorkPlace/css/style.css",
  "/WorkPlace/views/buscarempleo.html",
  "/WorkPlace/views/centrodeayuda.html",
  "/WorkPlace/views/contacto.html",
  "/WorkPlace/views/informaciontecnica.html",
  "/WorkPlace/views/paraempresas.html",
  "/WorkPlace/views/perfil.html",
  "/WorkPlace/views/publicarvacante.html",
  "/WorkPlace/Imagenes/WorkPlace_logo.webp",
  "/WorkPlace/Imagenes/icon-192.png",
  "/WorkPlace/Imagenes/icon-512.png",
  "/WorkPlace/Imagenes/icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;

      return fetch(e.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
          return response;
        })
        .catch(() => cached);
    })
  );
});

