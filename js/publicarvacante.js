// Asistente de 3 pasos para publicar una vacante.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacancyForm');
    const sections = form.querySelectorAll('[data-step]');
    const steps = document.querySelectorAll('.stepper__step');
    const publishButton = document.getElementById('publishButton');

    function goToStep(number) {
        sections.forEach((section) => {
            section.hidden = Number(section.dataset.step) !== number;
        });
        steps.forEach((step, index) => {
            step.classList.toggle('is-done', index + 1 < number || number === steps.length);
            step.classList.toggle('is-active', index + 1 === number);
        });
    }

    // Valida solo los campos del paso visible y señala el primero vacío
    function isStepValid(number) {
        const fields = form.querySelector(`[data-step="${number}"]`).querySelectorAll('[required]');
        return Array.from(fields).every((field) => field.reportValidity());
    }

    document.getElementById('nextStep').addEventListener('click', () => {
        if (isStepValid(1)) goToStep(2);
    });

    document.getElementById('prevStep').addEventListener('click', () => goToStep(1));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isStepValid(2)) return;

        publishButton.disabled = true;
        publishButton.textContent = 'Publicando...';

        setTimeout(() => {
            publishButton.disabled = false;
            publishButton.textContent = 'Publicar Vacante';
            goToStep(3);
        }, 800);
    });

    document.getElementById('publishAnother').addEventListener('click', () => {
        form.reset();
        goToStep(1);
    });
});
