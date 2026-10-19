const CACHE_NAME = "workplace-v4";
const FILES = [
  "/WorkPlace/",
  "/WorkPlace/index.html",
  "/WorkPlace/manifest.json",
  "/WorkPlace/css/style.css",
  "/WorkPlace/js/main.js",
  "/WorkPlace/js/buscarempleo.js",
  "/WorkPlace/js/publicarvacante.js",
  "/WorkPlace/views/buscarempleo.html",
  "/WorkPlace/views/centrodeayuda.html",
  "/WorkPlace/views/contacto.html",
  "/WorkPlace/views/informaciontecnica.html",
  "/WorkPlace/views/mapadelsitio.html",
  "/WorkPlace/views/paraempresas.html",
  "/WorkPlace/views/perfil.html",
  "/WorkPlace/views/publicarvacante.html",
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

// Guarda en caché solo respuestas válidas del mismo origen
function putInCache(request, response) {
  if (!response || response.status !== 200 || response.type !== "basic") return;
  const responseClone = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
}

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // Páginas HTML: primero la red para mostrar siempre la versión más reciente;
  // si no hay conexión, se usa la copia en caché.
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(request, response);
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/WorkPlace/index.html"))
        )
    );
    return;
  }

  // CSS, JS e imágenes: se responde al instante desde caché y se actualiza
  // en segundo plano (stale-while-revalidate).
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          putInCache(request, response);
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
