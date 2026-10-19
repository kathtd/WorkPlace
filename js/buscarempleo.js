// Búsqueda, filtros y orden de las vacantes en "Buscar Empleo".

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobSearchForm');
    const queryInput = document.getElementById('searchQuery');
    const cityInput = document.getElementById('searchCity');
    const categorySelect = document.getElementById('filterCategoria');
    const sortSelect = document.getElementById('sortJobs');
    const list = document.getElementById('jobsList');
    const count = document.getElementById('resultsCount');
    const empty = document.getElementById('jobsEmpty');
    const filterInputs = document.querySelectorAll('.filters input');

    // Compara textos sin tildes ni mayúsculas
    const normalize = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

    categorySelect.insertAdjacentHTML('beforeend', CATEGORIAS.map((c) => `<option>${Formato.html(c)}</option>`).join(''));

    // Precarga la búsqueda que llega desde el inicio (?q=...&ciudad=...&categoria=...)
    const params = new URLSearchParams(window.location.search);
    queryInput.value = params.get('q') || '';
    cityInput.value = params.get('ciudad') || '';
    categorySelect.value = CATEGORIAS.includes(params.get('categoria')) ? params.get('categoria') : '';

    const ORDEN = {
        recientes: (a, b) => Vacantes.horas(a) - Vacantes.horas(b),
        mayor: (a, b) => b.salarioMax - a.salarioMax,
        menor: (a, b) => a.salarioMin - b.salarioMin,
    };

    function render() {
        const query = normalize(queryInput.value);
        const city = normalize(cityInput.value);
        const category = categorySelect.value;
        const modalities = Array.from(document.querySelectorAll('input[name="modalidad"]:checked')).map((input) => input.value);
        const salary = document.querySelector('input[name="salario"]:checked')?.value;
        const [salaryMin, salaryMax] = salary ? salary.split('-').map(Number) : [0, Infinity];

        const resultados = Vacantes.todas().filter((v) =>
            (!query || normalize(`${v.titulo} ${v.empresa} ${(v.etiquetas || []).join(' ')}`).includes(query)) &&
            (!city || normalize(v.ciudad).includes(city)) &&
            (!category || v.categoria === category) &&
            (modalities.length === 0 || modalities.includes(v.modalidad)) &&
            (!salary || (v.salarioMin > 0 && v.salarioMin <= salaryMax && v.salarioMax >= salaryMin))
        ).sort(ORDEN[sortSelect.value]);

        list.innerHTML = resultados.map(Vacantes.fila).join('');
        count.textContent = resultados.length;
        empty.hidden = resultados.length > 0;
    }

    function clearAll() {
        form.reset();
        queryInput.value = '';
        cityInput.value = '';
        categorySelect.value = '';
        filterInputs.forEach((input) => { input.checked = false; });
        history.replaceState(null, '', window.location.pathname);
        render();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const termino = [queryInput.value.trim(), cityInput.value.trim()].filter(Boolean).join(' en ');
        if (termino) Store.logActividad(`Búsqueda: ${termino}`, 'fa-solid fa-magnifying-glass', 'blue');
        render();
    });
    filterInputs.forEach((input) => input.addEventListener('change', render));
    categorySelect.addEventListener('change', render);
    sortSelect.addEventListener('change', render);
    document.getElementById('clearFilters').addEventListener('click', clearAll);
    document.getElementById('showAllJobs').addEventListener('click', clearAll);

    Vacantes.activarAcciones(list);
    render();
});
