# WorkPlace

Plataforma de empleo para Colombia: búsqueda de vacantes, postulación, perfil del candidato y publicación de ofertas para empresas. Es un sitio estático (HTML, CSS y JavaScript sin frameworks) instalable como aplicación (PWA).

Sitio publicado: https://kathtd.github.io/WorkPlace/

## Estructura

```
WorkPlace/
├── index.html, views/*.html   Páginas finales (GENERADAS, no editar a mano)
├── tools/
│   ├── build.js               Genera las páginas a partir de pages/ y partials/
│   ├── serve.js               Servidor local para probar el sitio
│   ├── pages/                 Contenido propio de cada página  ← editar aquí
│   └── partials/              Header, footer, head, modales y sección de contacto
├── data/vacantes.js           Fuente única de vacantes y categorías
├── js/
│   ├── store.js               Datos del usuario en el navegador (localStorage)
│   ├── main.js                Comportamiento común (menús, modal, actividades)
│   ├── vacantes.js            Plantillas y acciones Guardar / Postularme
│   └── <página>.js            Lógica propia de cada página
├── css/style.css              Estilos (paleta azul en las variables de :root)
├── vendor/fontawesome/        Íconos Font Awesome Free 6.5.2 (locales, para uso sin conexión)
├── Imagenes/, screenshots/    Íconos, foto y capturas de la PWA
├── manifest.json, sw.js       Configuración PWA y service worker
```

## Cómo editar

**Header, footer o cualquier página:** edita los archivos de `tools/partials/` o `tools/pages/` y luego genera:

```bash
node tools/build.js
```

Esto reescribe `index.html` y `views/*.html`. Si editas esos archivos directamente, el próximo build borrará tus cambios.

Cada página en `tools/pages/` empieza con un bloque de configuración:

```html
<!--
title: Buscar Empleo | WorkPlace
description: Texto que aparece en buscadores
active: empleos
scripts: data/vacantes.js, js/vacantes.js, js/buscarempleo.js
-->
```

Marcadores disponibles: `{{base}}` (ruta a la raíz, útil en enlaces e imágenes) e `{{include:nombre}}` (inserta `tools/partials/nombre.html`).

**Agregar o cambiar vacantes:** edita `data/vacantes.js`. Las vacantes con `enInicio: true` aparecen en el inicio; todas aparecen en Buscar Empleo y tienen su página de detalle en `views/vacante.html?id=<id>`.

**Páginas nuevas:** crea el archivo en `tools/pages/views/`, ejecuta el build y agrega la ruta a la lista `FILES` de `sw.js` para que funcione sin conexión.

**Después de cambiar archivos:** sube el número de `CACHE_NAME` en `sw.js` (por ejemplo `workplace-v6`) para que quienes tienen la app instalada reciban los cambios.

## Probar en local

```bash
node tools/serve.js
```

Abre http://localhost:5173. Abrir los HTML con doble clic también funciona, pero sin service worker.

## Datos del usuario

El perfil, la foto, las postulaciones, las vacantes guardadas y publicadas, las preferencias y el historial se guardan solo en el navegador (`localStorage`). No hay servidor. Se pueden borrar desde **Información Técnica → Tus datos**.

## Publicar

El sitio se publica con GitHub Pages desde la rama `main`. Antes de subir cambios, ejecuta `node tools/build.js` y confirma que las páginas generadas quedaron incluidas en el commit.

## Pendientes conocidos

- El contenido de `views/legal.html` es una plantilla de referencia: debe revisarlo un abogado antes de operar con usuarios reales.
- Para usuarios reales con cuentas compartidas entre dispositivos se necesita un backend (por ejemplo Supabase o Firebase).
