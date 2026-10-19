// Servidor local para probar el sitio (incluido el service worker, que no
// funciona abriendo los archivos con doble clic).
//
// Uso:  node tools/serve.js   y abre http://localhost:5173

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 5173;
const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (urlPath.endsWith('/')) urlPath += 'index.html';

    const file = path.join(ROOT, urlPath);
    // Evita servir archivos fuera del proyecto (por ejemplo con "../")
    if (!file.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Prohibido');
        return;
    }

    fs.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('No encontrado');
            return;
        }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`WorkPlace disponible en http://localhost:${PORT}`);
});
