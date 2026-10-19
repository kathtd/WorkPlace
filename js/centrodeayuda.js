// Centro de Ayuda: filtra las preguntas frecuentes mientras se escribe.

document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('faqSearch');
    const items = document.querySelectorAll('#faqList .faq__item');
    const empty = document.getElementById('faqEmpty');
    const normalize = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    search.addEventListener('input', () => {
        const term = normalize(search.value.trim());
        let visible = 0;
        items.forEach((item) => {
            const matches = !term || normalize(item.textContent).includes(term);
            item.hidden = !matches;
            item.open = Boolean(term) && matches;
            if (matches) visible++;
        });
        empty.hidden = visible > 0;
    });

    // Con Enter, baja a la sección de preguntas para ver los resultados
    search.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('faq').scrollIntoView();
    });
});
