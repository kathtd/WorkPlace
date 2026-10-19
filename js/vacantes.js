// Acceso a las vacantes (data/vacantes.js + las publicadas por el usuario),
// plantillas HTML compartidas y acciones de Guardar / Postularme.

const Vacantes = (() => {
    const HOUR = 60 * 60 * 1000;
    const DETALLE_URL = new URL('../views/vacante.html', document.currentScript.src).href;
    const esc = Formato.html;

    const todas = () => [...Store.getVacantesPublicadas(), ...VACANTES];

    const buscar = (id) => todas().find((v) => String(v.id) === String(id));

    const horas = (v) => (v.fecha ? (Date.now() - v.fecha) / HOUR : v.publicadoHace);

    const publicado = (v) => Formato.haceTiempo(Date.now() - horas(v) * HOUR);

    function salario(v) {
        if (!v.salarioMin) return v.salarioTexto || 'A convenir';
        return v.salarioMin === v.salarioMax
            ? Formato.pesos(v.salarioMin)
            : `${Formato.pesos(v.salarioMin)} - ${Formato.pesos(v.salarioMax)}`;
    }

    const url = (id) => `${DETALLE_URL}?id=${encodeURIComponent(id)}`;

    function favoritoButton(v) {
        const activo = Store.isFavorito(v.id);
        return `<button type="button" class="fav-button${activo ? ' is-active' : ''}" data-action="favorito" data-id="${esc(v.id)}" aria-label="Guardar vacante: ${esc(v.titulo)}" aria-pressed="${activo}"><i class="${activo ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i></button>`;
    }

    function postularButton(v, clase = 'apply-button') {
        const hecho = Store.yaPostulado(v.id);
        return `<button type="button" class="${clase}" data-action="postular" data-id="${esc(v.id)}"${hecho ? ' disabled' : ''}>${hecho ? '<i class="fa-solid fa-check" aria-hidden="true"></i> Postulado' : 'Postularme'}</button>`;
    }

    // Tarjeta de "Vacantes Destacadas" del inicio
    function tarjeta(v) {
        return `<article class="job-card">
    <div class="job-card__header">
        <div class="job-card__top">
            <h3 class="job-card__title">${esc(v.titulo)}</h3>
            <span class="badge badge--secondary">${esc(v.jornada)}</span>
        </div>
        <p class="job-card__company">${esc(v.empresa)}</p>
    </div>
    <div class="job-card__body">
        <div class="job-card__meta">
            <span class="job-card__meta-item"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${esc(v.ciudad)}</span>
            <span class="job-card__meta-item"><i class="fa-solid fa-dollar-sign" aria-hidden="true"></i> ${esc(salario(v))} COP</span>
            <span class="job-card__meta-item"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${publicado(v)}</span>
        </div>
        <div class="tag-list">${(v.etiquetas || []).map((t) => `<span class="badge badge--outline">${esc(t)}</span>`).join('')}</div>
        <a href="${url(v.id)}" class="btn btn--primary btn--block">Ver Detalles<span class="sr-only"> de ${esc(v.titulo)}</span></a>
    </div>
</article>`;
    }

    // Fila del listado de "Buscar Empleo"
    function fila(v) {
        return `<article class="job-row">
    ${v.destacada ? '<span class="job-row__ribbon">Destacado</span>' : ''}
    <div class="job-row__main">
        <span class="job-row__logo" aria-hidden="true">${esc(v.empresa.charAt(0).toUpperCase())}</span>
        <div class="job-row__info">
            <h3 class="job-row__title"><a href="${url(v.id)}">${esc(v.titulo)}</a> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></h3>
            <p class="job-row__company">${esc(v.empresa)}${v.propia ? ' <span class="badge badge--soft">Tu publicación</span>' : ''}</p>
            <div class="job-row__meta">
                <span class="job-row__location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${esc(v.ciudad)}</span>
                <span class="job-row__salary">${esc(salario(v))}</span>
            </div>
        </div>
    </div>
    <div class="job-row__side">
        <div class="job-row__badges">
            <span class="badge badge--soft">${esc(v.modalidad)}</span>
            <span class="job-row__time">${publicado(v)}</span>
        </div>
        <div class="job-row__actions">
            ${favoritoButton(v)}
            ${postularButton(v)}
        </div>
    </div>
</article>`;
    }

    // Maneja los botones data-action="favorito" y data-action="postular" dentro de un contenedor
    function activarAcciones(contenedor) {
        contenedor.addEventListener('click', (e) => {
            const boton = e.target.closest('[data-action]');
            if (!boton) return;
            const v = buscar(boton.dataset.id);
            if (!v) return;

            if (boton.dataset.action === 'favorito') {
                const activo = Store.toggleFavorito(v.id);
                document.querySelectorAll(`[data-action="favorito"][data-id="${CSS.escape(String(v.id))}"]`).forEach((b) => {
                    b.classList.toggle('is-active', activo);
                    b.setAttribute('aria-pressed', activo);
                    b.querySelector('i').className = `${activo ? 'fa-solid' : 'fa-regular'} fa-heart`;
                });
                if (activo) Store.logActividad(`Guardaste la vacante: ${v.titulo}`, 'fa-regular fa-heart', 'orange');
                showToast(activo ? 'Vacante guardada en tu perfil.' : 'Vacante eliminada de tus guardadas.');
            }

            if (boton.dataset.action === 'postular') {
                if (Store.addPostulacion(v)) {
                    Store.logActividad(`Postulación enviada para: ${v.titulo}`, 'fa-solid fa-briefcase', 'green');
                    showToast(`Postulación enviada para: ${v.titulo}. Puedes seguirla en tu perfil.`);
                }
                document.querySelectorAll(`[data-action="postular"][data-id="${CSS.escape(String(v.id))}"]`).forEach((b) => {
                    b.disabled = true;
                    b.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Postulado';
                });
            }
        });
    }

    return { todas, buscar, horas, publicado, salario, url, tarjeta, fila, favoritoButton, postularButton, activarAcciones };
})();
