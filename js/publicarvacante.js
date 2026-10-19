// Asistente de 3 pasos para publicar una vacante. La vacante se guarda en el
// navegador y aparece en "Buscar Empleo".

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacancyForm');
    const sections = form.querySelectorAll('[data-step]');
    const steps = document.querySelectorAll('.stepper__step');
    const publishButton = document.getElementById('publishButton');
    const verVacante = document.getElementById('verVacante');

    document.getElementById('categoria').innerHTML = CATEGORIAS.map((c) => `<option>${Formato.html(c)}</option>`).join('');

    function goToStep(number) {
        sections.forEach((section) => {
            section.hidden = Number(section.dataset.step) !== number;
        });
        steps.forEach((step, index) => {
            step.classList.toggle('is-done', index + 1 < number || number === steps.length);
            step.classList.toggle('is-active', index + 1 === number);
            if (index + 1 === number) step.setAttribute('aria-current', 'step');
            else step.removeAttribute('aria-current');
        });
        form.querySelector(`[data-step="${number}"]`).querySelector('h1, input').focus();
    }

    // Valida solo los campos del paso visible y señala el primero vacío
    function isStepValid(number) {
        const fields = form.querySelector(`[data-step="${number}"]`).querySelectorAll('[required]');
        return Array.from(fields).every((field) => {
            field.value = field.value.trim();
            return field.reportValidity();
        });
    }

    // "5M - 8M" -> [5000000, 8000000]; "2.500.000" -> [2500000, 2500000]
    function parseSalario(texto) {
        const valores = (texto.match(/\d+(?:[.,]\d+)*\s*(?:m(?:illones)?\b)?/gi) || []).map((parte) => {
            const millones = /m/i.test(parte);
            const numero = Number(parte.replace(/[^\d.,]/g, '').replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.'));
            return Math.round(millones ? numero * 1000000 : numero);
        }).filter((n) => n >= 100000);
        if (!valores.length) return [0, 0];
        return [Math.min(...valores), Math.max(...valores)];
    }

    const lineas = (texto) => texto.split('\n').map((l) => l.trim()).filter(Boolean);

    document.getElementById('nextStep').addEventListener('click', () => {
        if (isStepValid(1)) goToStep(2);
    });

    document.getElementById('prevStep').addEventListener('click', () => goToStep(1));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isStepValid(2)) return;

        const datos = new FormData(form);
        const [salarioMin, salarioMax] = parseSalario(datos.get('salario'));
        const vacante = {
            id: `p-${Date.now()}`,
            titulo: datos.get('cargo'),
            empresa: datos.get('empresa'),
            ciudad: datos.get('ubicacion'),
            salarioMin,
            salarioMax,
            salarioTexto: datos.get('salario'),
            modalidad: datos.get('modalidad'),
            jornada: datos.get('jornada'),
            categoria: datos.get('categoria'),
            fecha: Date.now(),
            etiquetas: [datos.get('categoria'), datos.get('modalidad')],
            descripcion: datos.get('descripcion').trim(),
            requisitos: lineas(datos.get('requisitos')),
            beneficios: lineas(datos.get('beneficios')),
            propia: true,
        };

        publishButton.disabled = true;
        publishButton.textContent = 'Publicando...';

        setTimeout(() => {
            publishButton.disabled = false;
            publishButton.textContent = 'Publicar Vacante';

            if (!Store.addVacantePublicada(vacante)) {
                showToast('No pudimos guardar la vacante: tu navegador no permite almacenar datos.');
                return;
            }
            Store.logActividad(`Publicaste la vacante: ${vacante.titulo}`, 'fa-solid fa-file-circle-plus', 'green');
            verVacante.href = `vacante.html?id=${encodeURIComponent(vacante.id)}`;
            goToStep(3);
        }, 600);
    });

    document.getElementById('publishAnother').addEventListener('click', () => {
        form.reset();
        goToStep(1);
    });
});
