// Búsqueda, filtros y orden de las vacantes en "Buscar Empleo".

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobSearchForm');
    const queryInput = document.getElementById('searchQuery');
    const cityInput = document.getElementById('searchCity');
    const sortSelect = document.getElementById('sortJobs');
    const list = document.getElementById('jobsList');
    const count = document.getElementById('resultsCount');
    const empty = document.getElementById('jobsEmpty');
    const filterInputs = document.querySelectorAll('.filters input');
    const jobs = Array.from(list.querySelectorAll('.job-row'));

    // Compara textos sin tildes ni mayúsculas
    const normalize = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

    // Precarga la búsqueda que llega desde el inicio (?q=...&ciudad=...)
    const params = new URLSearchParams(window.location.search);
    queryInput.value = params.get('q') || '';
    cityInput.value = params.get('ciudad') || '';

    function applyFilters() {
        const query = normalize(queryInput.value);
        const city = normalize(cityInput.value);
        const modalities = Array.from(document.querySelectorAll('input[name="modalidad"]:checked')).map((input) => input.value);
        const salary = document.querySelector('input[name="salario"]:checked')?.value;
        const [salaryMin, salaryMax] = salary ? salary.split('-').map(Number) : [0, Infinity];

        let visible = 0;
        jobs.forEach((job) => {
            const title = normalize(job.querySelector('.job-row__title').textContent);
            const company = normalize(job.querySelector('.job-row__company').textContent);
            const location = normalize(job.querySelector('.job-row__location').textContent);
            const min = Number(job.dataset.min);
            const max = Number(job.dataset.max);

            const matches =
                (!query || title.includes(query) || company.includes(query)) &&
                (!city || location.includes(city)) &&
                (modalities.length === 0 || modalities.includes(job.dataset.modalidad)) &&
                (min <= salaryMax && max >= salaryMin);

            job.hidden = !matches;
            if (matches) visible++;
        });

        count.textContent = visible;
        empty.hidden = visible > 0;
    }

    function applySort() {
        const order = {
            recientes: (a, b) => a.dataset.age - b.dataset.age,
            mayor: (a, b) => b.dataset.max - a.dataset.max,
            menor: (a, b) => a.dataset.min - b.dataset.min,
        }[sortSelect.value];

        [...jobs].sort(order).forEach((job) => list.appendChild(job));
    }

    function clearAll() {
        form.reset();
        queryInput.value = '';
        cityInput.value = '';
        filterInputs.forEach((input) => { input.checked = false; });
        applyFilters();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });
    filterInputs.forEach((input) => input.addEventListener('change', applyFilters));
    sortSelect.addEventListener('change', applySort);
    document.getElementById('clearFilters').addEventListener('click', clearAll);
    document.getElementById('showAllJobs').addEventListener('click', clearAll);

    // Guardar vacantes como favoritas
    list.addEventListener('click', (e) => {
        const favButton = e.target.closest('.fav-button');
        if (!favButton) return;
        const isActive = favButton.classList.toggle('is-active');
        favButton.setAttribute('aria-pressed', isActive);
        favButton.querySelector('i').className = isActive ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    });

    applySort();
    applyFilters();
});
