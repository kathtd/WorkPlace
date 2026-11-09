// Conexión con la API de cuentas del backend (Java). Esa API corre aparte:
// en el equipo local con `mvnw jetty:run-war` (ver backend/README.md).

const Sesion = (() => {
    const API = 'http://localhost:8080/workplace/api';

    async function pedir(ruta, opciones = {}) {
        const sesion = Store.getSesion();
        const cabeceras = { 'Content-Type': 'application/json' };
        if (sesion?.token) cabeceras.Authorization = 'Bearer ' + sesion.token;
        const resp = await fetch(API + ruta, { ...opciones, headers: cabeceras });
        return { estado: resp.status, datos: await resp.json() };
    }

    // Guarda la sesión y pone los datos del usuario en el perfil del sitio
    function abrir(token, usuario) {
        Store.saveSesion({ token });
        Store.savePerfil({
            nombre: usuario.nombres + ' ' + usuario.apellidos,
            email: usuario.correo,
            telefono: usuario.telefono,
            rol: 'Candidato',
        });
    }

    async function cerrar() {
        try {
            await pedir('/logout', { method: 'POST' });
        } catch {
            // si el servidor no responde, igual se cierra en este navegador
        }
        Store.clearSesion();
    }

    return { pedir, abrir, cerrar, activa: () => Boolean(Store.getSesion()?.token) };
})();
