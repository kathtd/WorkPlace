// Perfil: datos personales, foto, hoja de vida, preferencias,
// historial de postulaciones y vacantes guardadas.

document.addEventListener('DOMContentLoaded', () => {
    const esc = Formato.html;

    // ---------- Editar perfil ----------
    const overlay = document.getElementById('editProfileOverlay');
    const editForm = document.getElementById('editProfileForm');

    function abrirEdicion() {
        const perfil = Store.getPerfil();
        ['nombre', 'email', 'telefono', 'ciudad'].forEach((campo) => {
            editForm.elements[campo].value = perfil[campo] || '';
        });
        overlay.classList.add('is-open');
        abrirDialogo(overlay);
    }

    function cerrarEdicion() {
        if (!overlay.classList.contains('is-open')) return;
        overlay.classList.remove('is-open');
        cerrarDialogo();
    }

    document.getElementById('editarPerfil').addEventListener('click', abrirEdicion);
    document.getElementById('editProfileClose').addEventListener('click', cerrarEdicion);
    document.getElementById('editProfileCancel').addEventListener('click', cerrarEdicion);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarEdicion();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarEdicion();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(editForm));
        Object.keys(datos).forEach((k) => { datos[k] = datos[k].trim(); });
        Store.savePerfil(datos);
        refreshProfile();
        cerrarEdicion();
        Store.logActividad('Actualizaste los datos de tu perfil', 'fa-regular fa-user', 'blue');
        showToast('Perfil actualizado correctamente.');
    });

    // ---------- Foto de perfil (se reduce a 192 px antes de guardarla) ----------
    const fotoInput = document.getElementById('fotoInput');
    document.getElementById('cambiarFoto').addEventListener('click', () => fotoInput.click());

    fotoInput.addEventListener('change', () => {
        const archivo = fotoInput.files[0];
        if (!archivo) return;
        const img = new Image();
        img.onload = () => {
            const lado = 192;
            const canvas = document.createElement('canvas');
            canvas.width = lado;
            canvas.height = lado;
            const escala = Math.max(lado / img.width, lado / img.height);
            const w = img.width * escala;
            const h = img.height * escala;
            canvas.getContext('2d').drawImage(img, (lado - w) / 2, (lado - h) / 2, w, h);
            URL.revokeObjectURL(img.src);
            Store.savePerfil({ foto: canvas.toDataURL('image/jpeg', 0.85) });
            refreshProfile();
            Store.logActividad('Cambiaste tu foto de perfil', 'fa-solid fa-camera', 'blue');
            showToast('Foto de perfil actualizada.');
        };
        img.onerror = () => showToast('No pudimos leer esa imagen. Prueba con un JPG o PNG.');
        img.src = URL.createObjectURL(archivo);
        fotoInput.value = '';
    });

    // ---------- Hoja de vida ----------
    const cvInput = document.getElementById('cvInput');

    function renderCV() {
        const cv = Store.getCV();
        document.getElementById('cvNombre').textContent = cv ? cv.nombre : 'Sin hoja de vida';
        document.getElementById('cvFecha').textContent = cv ? `Subida el ${Formato.fecha(cv.fecha)}` : 'Sube tu documento en PDF o Word';
    }

    document.getElementById('subirCV').addEventListener('click', () => cvInput.click());
    cvInput.addEventListener('change', () => {
        const archivo = cvInput.files[0];
        if (!archivo) return;
        if (archivo.size > 5 * 1024 * 1024) {
            showToast('El archivo supera 5 MB. Sube una versión más liviana.');
            cvInput.value = '';
            return;
        }
        Store.saveCV({ nombre: archivo.name, fecha: Date.now() });
        renderCV();
        Store.logActividad('Actualizaste tu hoja de vida', 'fa-regular fa-file-lines', 'gray');
        showToast('Hoja de vida actualizada.');
        cvInput.value = '';
    });

    // ---------- Preferencias ----------
    const prefsForm = document.getElementById('prefsForm');
    const prefs = Store.getPreferencias();
    ['alertas', 'estados', 'boletin'].forEach((k) => { prefsForm.elements[k].checked = prefs[k]; });
    prefsForm.elements.modalidad.value = prefs.modalidad;

    prefsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        Store.savePreferencias({
            alertas: prefsForm.elements.alertas.checked,
            estados: prefsForm.elements.estados.checked,
            boletin: prefsForm.elements.boletin.checked,
            modalidad: prefsForm.elements.modalidad.value,
        });
        Store.logActividad('Actualizaste tus preferencias', 'fa-solid fa-gear', 'gray');
        showToast('Preferencias guardadas.');
    });

    // ---------- Postulaciones ----------
    const ESTADOS = { 'Enviada': 'status--progress', 'En Proceso': 'status--progress', 'Visto': 'status--seen', 'Finalizado': 'status--done' };

    function renderPostulaciones() {
        const lista = Store.getPostulaciones();
        const activas = lista.filter((p) => p.estado !== 'Finalizado').length;
        document.getElementById('postulacionesActivas').textContent = `${activas} Activa${activas === 1 ? '' : 's'}`;
        document.getElementById('sinPostulaciones').hidden = lista.length > 0;
        document.getElementById('listaPostulaciones').innerHTML = lista.map((p) => {
            const vacante = p.id && Vacantes.buscar(p.id);
            const titulo = vacante ? `<a href="${Vacantes.url(p.id)}">${esc(p.titulo)}</a>` : esc(p.titulo);
            return `<li class="application">
                <div class="application__main">
                    <span class="application__icon"><i class="fa-solid fa-briefcase" aria-hidden="true"></i></span>
                    <div><p class="application__title">${titulo}</p><p class="application__meta">${esc(p.empresa)} • ${Formato.haceTiempo(p.fecha)}</p></div>
                </div>
                <span class="status ${ESTADOS[p.estado] || 'status--progress'}">${esc(p.estado)}</span>
            </li>`;
        }).join('');
    }

    // ---------- Vacantes guardadas ----------
    const listaGuardadas = document.getElementById('listaGuardadas');

    function renderGuardadas() {
        const guardadas = Store.getFavoritos().map(Vacantes.buscar).filter(Boolean);
        document.getElementById('sinGuardadas').hidden = guardadas.length > 0;
        listaGuardadas.innerHTML = guardadas.map((v) => `<li class="application">
            <div class="application__main">
                <span class="application__icon" aria-hidden="true">${esc(v.empresa.charAt(0).toUpperCase())}</span>
                <div><p class="application__title"><a href="${Vacantes.url(v.id)}">${esc(v.titulo)}</a></p><p class="application__meta">${esc(v.empresa)} • ${esc(v.ciudad)}</p></div>
            </div>
            ${Vacantes.favoritoButton(v)}
        </li>`).join('');
    }

    // Al quitar una vacante de guardadas, se actualiza la lista
    Vacantes.activarAcciones(listaGuardadas);
    listaGuardadas.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="favorito"]')) renderGuardadas();
    });

    renderCV();
    renderPostulaciones();
    renderGuardadas();
});
