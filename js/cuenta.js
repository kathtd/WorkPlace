// Página "Mi cuenta": iniciar sesión y crear cuenta con la API del backend.

document.addEventListener('DOMContentLoaded', () => {
    const vistas = {
        ingresar: document.getElementById('vista-ingresar'),
        registro: document.getElementById('vista-registro'),
    };
    const CAMPOS = ['documento', 'nombres', 'apellidos', 'correo', 'telefono', 'clave'];
    const SIN_SERVIDOR = 'No pudimos conectarnos con el servicio de cuentas. Si estás probando en tu equipo, enciende el servidor del backend.';

    // La parte final de la dirección (#registro o #ingresar) decide qué formulario se ve
    function mostrarSegunHash() {
        const vista = location.hash === '#registro' ? 'registro' : 'ingresar';
        Object.keys(vistas).forEach((k) => { vistas[k].hidden = k !== vista; });
    }
    window.addEventListener('hashchange', mostrarSegunHash);
    mostrarSegunHash();

    if (Sesion.activa()) {
        location.replace('perfil.html');
        return;
    }

    function alerta(id, texto) {
        document.getElementById(id + '-mensaje').textContent = texto || '';
        document.getElementById(id + '-alerta').hidden = !texto;
    }

    document.getElementById('form-ingresar').addEventListener('submit', async (e) => {
        e.preventDefault();
        alerta('ingresar', '');
        try {
            const { estado, datos } = await Sesion.pedir('/login', {
                method: 'POST',
                body: JSON.stringify({
                    correo: document.getElementById('i-correo').value,
                    clave: document.getElementById('i-clave').value,
                }),
            });
            if (estado !== 200) {
                alerta('ingresar', datos.mensaje);
                return;
            }
            Sesion.abrir(datos.token, datos.usuario);
            Store.logActividad('Iniciaste sesión en WorkPlace', 'fa-solid fa-right-to-bracket', 'green');
            location.href = 'perfil.html';
        } catch {
            alerta('ingresar', SIN_SERVIDOR);
        }
    });

    document.getElementById('form-registro').addEventListener('submit', async (e) => {
        e.preventDefault();
        alerta('registro', '');
        CAMPOS.forEach((c) => { document.getElementById('e-' + c).hidden = true; });
        const cuerpo = {};
        CAMPOS.forEach((c) => { cuerpo[c] = document.getElementById('r-' + c).value; });
        try {
            const { estado, datos } = await Sesion.pedir('/registro', { method: 'POST', body: JSON.stringify(cuerpo) });
            if (estado === 201) {
                e.target.reset();
                document.getElementById('i-correo').value = datos.usuario.correo;
                location.hash = '#ingresar';
                document.getElementById('i-clave').focus();
                return;
            }
            Object.entries(datos.errores || {}).forEach(([campo, texto]) => {
                const p = document.getElementById('e-' + campo);
                p.textContent = texto;
                p.hidden = false;
            });
            alerta('registro', datos.errores ? 'Revisa los campos marcados.' : datos.mensaje);
        } catch {
            alerta('registro', SIN_SERVIDOR);
        }
    });
});
