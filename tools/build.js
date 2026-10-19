// Genera las páginas HTML del sitio uniendo las piezas compartidas
// (tools/partials) con el contenido de cada página (tools/pages).
//
// Uso:  node tools/build.js
//
// Cada archivo de tools/pages empieza con un bloque de configuración:
//   <!--
//   title: Buscar Empleo | WorkPlace
//   description: Texto para buscadores
//   active: empleos            (enlace del menú resaltado; vacío si ninguno)
//   scripts: js/buscarempleo.js (scripts propios de la página, separados por coma)
//   -->
//
// Marcadores disponibles en páginas y piezas:
//   {{base}}             ruta relativa a la raíz ("" en index, "../" en views/)
//   {{include:nombre}}   inserta tools/partials/nombre.html
//   {{nav}}              enlaces del menú principal (solo en header.html)
//   {{title}} {{description}}  (solo en head.html)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(__dirname, 'pages');
const PARTIALS_DIR = path.join(__dirname, 'partials');

// Scripts que cargan todas las páginas, en este orden
const COMMON_SCRIPTS = ['js/store.js', 'js/main.js'];

const NAV = [
    ['inicio', 'Inicio', 'index.html'],
    ['empleos', 'Buscar Empleos', 'views/buscarempleo.html'],
    ['publicar', 'Publicar Vacante', 'views/publicarvacante.html'],
    ['empresas', 'Para Empresas', 'views/paraempresas.html'],
    ['contacto', 'Contacto', 'views/contacto.html'],
];

const readPartial = (name) => {
    const file = path.join(PARTIALS_DIR, `${name}.html`);
    if (!fs.existsSync(file)) throw new Error(`No existe la pieza "${name}" (${file})`);
    return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').trimEnd();
};

// Separa el bloque de configuración inicial del contenido de la página
function parsePage(source) {
    const match = source.match(/^<!--\n([\s\S]*?)\n-->\n/);
    if (!match) throw new Error('La página debe empezar con un bloque <!-- configuración -->');
    const config = {};
    for (const line of match[1].split('\n')) {
        const [key, ...rest] = line.split(':');
        if (key.trim()) config[key.trim()] = rest.join(':').trim();
    }
    return { config, body: source.slice(match[0].length).trimEnd() };
}

const indent = (text, spaces) =>
    text.split('\n').map((line) => (line.trim() ? ' '.repeat(spaces) + line : '')).join('\n');

// Resuelve {{include:x}} (con la indentación de la línea donde aparece) y {{base}}
function render(text, vars) {
    let out = text.replace(/^([ \t]*)\{\{include:([\w-]+)\}\}$/gm, (_, space, name) =>
        indent(render(readPartial(name), vars), space.length));
    for (const [key, value] of Object.entries(vars)) {
        out = out.split(`{{${key}}}`).join(value);
    }
    return out;
}

function navLinks(base, active) {
    return NAV.map(([key, label, href]) => {
        const current = key === active ? ' header__link--active" aria-current="page' : '';
        return `<a class="header__link${current}" href="${base}${href}">${label}</a>`;
    }).join('\n');
}

function buildPage(relativePath) {
    const source = fs.readFileSync(path.join(PAGES_DIR, relativePath), 'utf8').replace(/\r\n/g, '\n');
    const { config, body } = parsePage(source);
    const depth = relativePath.split(/[\\/]/).length - 1;
    const base = '../'.repeat(depth);

    const vars = {
        base,
        title: config.title || 'WorkPlace',
        description: config.description || '',
    };
    const nav = navLinks(base, config.active);
    const header = readPartial('header').replace(/^([ \t]*)\{\{nav\}\}$/gm, (_, space) => indent(nav, space.length));
    const scripts = [...COMMON_SCRIPTS, ...(config.scripts ? config.scripts.split(',').map((s) => s.trim()) : [])];

    const html = [
        render(readPartial('head'), vars),
        '<body>',
        indent(render(readPartial('skip-link'), vars), 4),
        indent(render(header, vars), 4),
        indent(render(body, vars), 4),
        indent(render(readPartial('footer'), vars), 4),
        indent(render(readPartial('overlays'), vars), 4),
        ...scripts.map((src) => `    <script src="${base}${src}"></script>`),
        '</body>',
        '</html>',
        '',
    ].join('\n');

    const leftover = html.match(/\{\{[^}]+\}\}/);
    if (leftover) throw new Error(`${relativePath}: marcador sin resolver ${leftover[0]}`);

    fs.writeFileSync(path.join(ROOT, relativePath), html.replace(/\n/g, '\r\n'));
    console.log(`  ✓ ${relativePath.replace(/\\/g, '/')}`);
}

function listPages(dir, prefix = '') {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const rel = path.join(prefix, entry.name);
        if (entry.isDirectory()) return listPages(path.join(dir, entry.name), rel);
        return entry.name.endsWith('.html') ? [rel] : [];
    });
}

console.log('Generando páginas...');
listPages(PAGES_DIR).forEach(buildPage);
console.log('Listo.');
