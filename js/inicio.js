// Inicio: vacantes destacadas y categorías del buscador desde data/vacantes.js.

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('featuredJobs');
    grid.innerHTML = VACANTES.filter((v) => v.enInicio).map(Vacantes.tarjeta).join('');

    const categoria = document.getElementById('homeCategoria');
    categoria.insertAdjacentHTML('beforeend', CATEGORIAS.map((c) => `<option>${Formato.html(c)}</option>`).join(''));
});
