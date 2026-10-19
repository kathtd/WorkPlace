// Datos del usuario guardados en el navegador (localStorage): perfil, favoritos,
// postulaciones, actividades, hoja de vida, preferencias y vacantes publicadas.
// Si el navegador bloquea el almacenamiento, todo sigue funcionando pero sin guardar.

const Store = (() => {
    const PREFIX = 'workplace:';
    const HOUR = 60 * 60 * 1000;

    function read(key, fallback) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    const PERFIL_INICIAL = {
        nombre: 'María González',
        email: 'maria.gonzalez@email.com',
        telefono: '+57 310 123 4567',
        ciudad: 'Bogotá, Colombia',
        rol: 'Candidato',
        foto: null,
    };

    // Datos de ejemplo para la primera visita
    function seed() {
        if (read('iniciado', false)) return;
        const now = Date.now();
        write('postulaciones', [
            { titulo: 'Desarrollador React', empresa: 'Rappi', fecha: now - 48 * HOUR, estado: 'En Proceso' },
            { titulo: 'UX Designer', empresa: 'Bancolombia', fecha: now - 120 * HOUR, estado: 'Visto' },
            { titulo: 'Project Manager', empresa: 'Localiza', fecha: now - 168 * HOUR, estado: 'Finalizado' },
        ]);
        write('actividades', [
            { texto: 'Iniciaste sesión en WorkPlace', icono: 'fa-solid fa-right-to-bracket', color: 'green', fecha: now - 5 * 60 * 1000 },
            { texto: 'Búsqueda: Desarrollador Frontend', icono: 'fa-solid fa-magnifying-glass', color: 'blue', fecha: now - 20 * 60 * 1000 },
            { texto: 'Postulación enviada para: Desarrollador React', icono: 'fa-solid fa-briefcase', color: 'blue', fecha: now - 48 * HOUR },
            { texto: 'Actualizaste tu hoja de vida', icono: 'fa-regular fa-file-lines', color: 'gray', fecha: now - 72 * HOUR },
        ]);
        write('cv', { nombre: 'HV_Actualizada_2026.pdf', fecha: new Date(2026, 1, 10).getTime() });
        write('iniciado', true);
    }

    seed();

    return {
        // Perfil
        getPerfil: () => ({ ...PERFIL_INICIAL, ...read('perfil', {}) }),
        savePerfil(cambios) {
            write('perfil', { ...read('perfil', {}), ...cambios });
        },

        // Favoritos (ids de vacantes)
        getFavoritos: () => read('favoritos', []),
        isFavorito(id) {
            return this.getFavoritos().includes(String(id));
        },
        toggleFavorito(id) {
            const favoritos = this.getFavoritos();
            const key = String(id);
            const isNow = !favoritos.includes(key);
            write('favoritos', isNow ? [...favoritos, key] : favoritos.filter((f) => f !== key));
            return isNow;
        },

        // Postulaciones
        getPostulaciones: () => read('postulaciones', []).sort((a, b) => b.fecha - a.fecha),
        yaPostulado(id) {
            return this.getPostulaciones().some((p) => String(p.id) === String(id));
        },
        addPostulacion(vacante) {
            if (this.yaPostulado(vacante.id)) return false;
            const lista = read('postulaciones', []);
            lista.push({ id: String(vacante.id), titulo: vacante.titulo, empresa: vacante.empresa, fecha: Date.now(), estado: 'Enviada' });
            write('postulaciones', lista);
            return true;
        },

        // Actividades (trazabilidad)
        getActividades: () => read('actividades', []).sort((a, b) => b.fecha - a.fecha),
        logActividad(texto, icono = 'fa-solid fa-circle-check', color = 'blue') {
            const lista = read('actividades', []);
            lista.push({ texto, icono, color, fecha: Date.now() });
            write('actividades', lista.slice(-50));
            window.dispatchEvent(new Event('workplace:actividades'));
        },
        clearActividades() {
            write('actividades', []);
            window.dispatchEvent(new Event('workplace:actividades'));
        },
        getActividadesVistas: () => read('actividadesVistas', 0),
        marcarActividadesVistas() {
            write('actividadesVistas', Date.now());
        },

        // Hoja de vida (solo se guarda el nombre y la fecha del archivo)
        getCV: () => read('cv', null),
        saveCV: (cv) => write('cv', cv),

        // Preferencias
        getPreferencias: () => ({ alertas: true, estados: true, boletin: false, modalidad: '', ...read('preferencias', {}) }),
        savePreferencias: (prefs) => write('preferencias', prefs),

        // Vacantes publicadas por el usuario
        getVacantesPublicadas: () => read('vacantesPublicadas', []),
        addVacantePublicada(vacante) {
            const lista = read('vacantesPublicadas', []);
            lista.push(vacante);
            return write('vacantesPublicadas', lista);
        },

        // Borra todos los datos guardados por WorkPlace en este navegador
        reset() {
            try {
                Object.keys(localStorage)
                    .filter((key) => key.startsWith(PREFIX))
                    .forEach((key) => localStorage.removeItem(key));
            } catch {
                // Sin acceso al almacenamiento no hay nada que borrar
            }
        },
    };
})();

// Utilidades de formato compartidas
const Formato = {
    // "Hace unos segundos", "Hace 5 minutos", "Hace 2 horas", "Hace 3 días"...
    haceTiempo(fecha) {
        const seg = Math.max(0, Math.floor((Date.now() - fecha) / 1000));
        if (seg < 60) return 'Hace unos segundos';
        if (seg < 3600) return `Hace ${Math.floor(seg / 60)} minuto${seg < 120 ? '' : 's'}`;
        if (seg < 86400) return `Hace ${Math.floor(seg / 3600)} hora${seg < 7200 ? '' : 's'}`;
        const dias = Math.floor(seg / 86400);
        if (dias < 7) return dias === 1 ? 'Ayer' : `Hace ${dias} días`;
        const semanas = Math.floor(dias / 7);
        return semanas < 5 ? `Hace ${semanas} semana${semanas === 1 ? '' : 's'}` : `Hace ${Math.floor(dias / 30)} mes${dias < 60 ? '' : 'es'}`;
    },

    // 18 Oct, 2026
    fecha(fecha) {
        const d = new Date(fecha);
        const mes = d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
        return `${d.getDate()} ${mes.charAt(0).toUpperCase()}${mes.slice(1)}, ${d.getFullYear()}`;
    },

    pesos: (valor) => '$' + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.'),

    // Escapa texto antes de insertarlo como HTML (los datos del usuario pueden traer < > &)
    html: (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),

    iniciales: (nombre) => nombre.trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0)).join('').toUpperCase() || '?',
};
