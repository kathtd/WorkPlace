const CACHE_NAME = "workplace-v5";

// Rutas relativas a la ubicación de sw.js: funcionan igual en GitHub Pages
// (/WorkPlace/) que en un servidor local (/).
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./vendor/fontawesome/css/all.min.css",
  "./vendor/fontawesome/webfonts/fa-solid-900.woff2",
  "./vendor/fontawesome/webfonts/fa-regular-400.woff2",
  "./vendor/fontawesome/webfonts/fa-brands-400.woff2",
  "./data/vacantes.js",
  "./js/store.js",
  "./js/main.js",
  "./js/vacantes.js",
  "./js/inicio.js",
  "./js/buscarempleo.js",
  "./js/vacante.js",
  "./js/publicarvacante.js",
  "./js/perfil.js",
  "./js/centrodeayuda.js",
  "./js/informaciontecnica.js",
  "./views/buscarempleo.html",
  "./views/vacante.html",
  "./views/publicarvacante.html",
  "./views/paraempresas.html",
  "./views/contacto.html",
  "./views/perfil.html",
  "./views/centrodeayuda.html",
  "./views/informaciontecnica.html",
  "./views/legal.html",
  "./views/mapadelsitio.html",
  "./Imagenes/icon-192.png",
  "./Imagenes/icon-512.png",
  "./Imagenes/icon-maskable-512.png",
  "./Imagenes/oficina.jpg"
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
  // si no hay conexión, se usa la copia en caché (ignorando ?id=... y similares).
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(request, response);
          return response;
        })
        .catch(() =>
          caches.match(request, { ignoreSearch: true })
            .then((cached) => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  // CSS, JS, fuentes e imágenes: se responde al instante desde caché y se
  // actualiza en segundo plano (stale-while-revalidate).
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
