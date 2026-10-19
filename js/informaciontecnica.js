// Información Técnica: resumen y borrado de los datos guardados en el navegador.

document.addEventListener('DOMContentLoaded', () => {
    const resumen = document.getElementById('datosResumen');

    function renderResumen() {
        const postulaciones = Store.getPostulaciones().length;
        const guardadas = Store.getFavoritos().length;
        const publicadas = Store.getVacantesPublicadas().length;
        resumen.textContent = `Actualmente tienes ${postulaciones} postulaciones, ${guardadas} vacantes guardadas y ${publicadas} vacantes publicadas en este navegador.`;
    }

    document.getElementById('borrarDatos').addEventListener('click', () => {
        if (!confirm('¿Seguro que quieres borrar todos tus datos de WorkPlace en este navegador? Esta acción no se puede deshacer.')) return;
        Store.reset();
        showToast('Tus datos fueron borrados. La página se recargará con los datos de ejemplo.');
        setTimeout(() => window.location.reload(), 1500);
    });

    renderResumen();
});
