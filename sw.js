const CACHE_NAME = "workplace-v1";
const FILES = [
  "/WorkPlace/",
  "/WorkPlace/index.html",
  "/WorkPlace/css/style.css",
  "/WorkPlace/views/buscarempleo.html",
  "/WorkPlace/views/centrodeayuda.html",
  "/WorkPlace/views/contacto.html",
  "/WorkPlace/views/informaciontecnica.html",
  "/WorkPlace/views/paraempresas.html",
  "/WorkPlace/views/perfil.html",
  "/WorkPlace/views/publicarvacante.html",
  "/WorkPlace/Imagenes/WorkPlace_logo.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
