// Detalle de una vacante: vacante.html?id=...

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('vacanteDetalle');
    const noEncontrada = document.getElementById('vacanteNoEncontrada');
    const id = new URLSearchParams(window.location.search).get('id');
    const v = id && Vacantes.buscar(id);
    const esc = Formato.html;

    if (!v) {
        contenedor.hidden = true;
        noEncontrada.hidden = false;
        return;
    }

    document.title = `${v.titulo} en ${v.empresa} | WorkPlace`;

    const lista = (items, icono) => items && items.length
        ? `<ul class="check-list">${items.map((i) => `<li><i class="${icono}" aria-hidden="true"></i><span>${esc(i)}</span></li>`).join('')}</ul>`
        : '<p class="detail__muted">La empresa no agregó información en esta sección.</p>';

    // Similares: misma categoría primero, luego misma ciudad
    const similares = Vacantes.todas()
        .filter((o) => String(o.id) !== String(v.id))
        .map((o) => ({ o, puntos: (o.categoria === v.categoria ? 2 : 0) + (o.ciudad === v.ciudad ? 1 : 0) }))
        .filter((x) => x.puntos > 0)
        .sort((a, b) => b.puntos - a.puntos)
        .slice(0, 3)
        .map((x) => x.o);

    contenedor.innerHTML = `<div class="detail">
    <div class="detail__main">
        <section class="panel-card detail__header">
            ${v.destacada ? '<span class="job-row__ribbon">Destacado</span>' : ''}
            <div class="detail__heading">
                <span class="job-row__logo" aria-hidden="true">${esc(v.empresa.charAt(0).toUpperCase())}</span>
                <div>
                    <h1 class="detail__title">${esc(v.titulo)}</h1>
                    <p class="detail__company">${esc(v.empresa)}</p>
                </div>
            </div>
            <div class="tag-list">
                <span class="badge badge--soft">${esc(v.modalidad)}</span>
                <span class="badge badge--secondary">${esc(v.jornada)}</span>
                ${v.categoria ? `<span class="badge badge--outline">${esc(v.categoria)}</span>` : ''}
            </div>
            <ul class="detail__meta">
                <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${esc(v.ciudad)}</li>
                <li><i class="fa-solid fa-dollar-sign" aria-hidden="true"></i> ${esc(Vacantes.salario(v))} COP</li>
                <li><i class="fa-regular fa-clock" aria-hidden="true"></i> Publicada ${Vacantes.publicado(v).toLowerCase()}</li>
            </ul>
            <div class="detail__actions">
                ${Vacantes.postularButton(v, 'btn btn--primary btn--lg')}
                ${Vacantes.favoritoButton(v)}
            </div>
        </section>
        <section class="panel-card">
            <h2 class="panel-card__heading detail__section-title">Descripción del cargo</h2>
            <p class="detail__text">${esc(v.descripcion || 'Sin descripción.')}</p>
        </section>
        <section class="panel-card">
            <h2 class="panel-card__heading detail__section-title">Requisitos</h2>
            ${lista(v.requisitos, 'fa-regular fa-circle-check')}
        </section>
        <section class="panel-card">
            <h2 class="panel-card__heading detail__section-title">Beneficios</h2>
            ${lista(v.beneficios, 'fa-solid fa-gift')}
        </section>
    </div>
    <aside class="detail__aside">
        <section class="panel-card panel-card--compact">
            <h2 class="panel-card__title">Resumen</h2>
            <dl class="summary">
                <div><dt>Salario</dt><dd>${esc(Vacantes.salario(v))}</dd></div>
                <div><dt>Modalidad</dt><dd>${esc(v.modalidad)}</dd></div>
                <div><dt>Jornada</dt><dd>${esc(v.jornada)}</dd></div>
                <div><dt>Ubicación</dt><dd>${esc(v.ciudad)}</dd></div>
                ${v.categoria ? `<div><dt>Categoría</dt><dd>${esc(v.categoria)}</dd></div>` : ''}
            </dl>
        </section>
        ${similares.length ? `<section class="panel-card panel-card--compact">
            <h2 class="panel-card__title">Vacantes similares</h2>
            <ul class="similar">
                ${similares.map((o) => `<li><a class="similar__item" href="${Vacantes.url(o.id)}">
                    <span class="similar__title">${esc(o.titulo)}</span>
                    <span class="similar__meta">${esc(o.empresa)} · ${esc(o.ciudad)}</span>
                </a></li>`).join('')}
            </ul>
        </section>` : ''}
    </aside>
</div>`;

    Vacantes.activarAcciones(contenedor);
    Store.logActividad(`Vista de vacante: ${v.titulo} en ${v.empresa}`, 'fa-regular fa-eye', 'orange');
});
