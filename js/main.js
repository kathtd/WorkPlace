// Comportamiento común a todas las páginas: service worker, menú móvil, menús
// desplegables, panel de actividades, modal de información y notificaciones.

// sw.js está en la raíz del proyecto, un nivel por encima de /js/
const swUrl = new URL('../sw.js', document.currentScript.src);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swUrl)
    .then(() => console.log('SW registrado'))
    .catch(err => console.log('Error SW:', err));
}

// Muestra una notificación breve en la esquina superior derecha
function showToast(message) {
    let region = document.querySelector('.toast-region');
    if (!region) {
        region = document.createElement('div');
        region.className = 'toast-region';
        region.setAttribute('aria-live', 'polite');
        document.body.appendChild(region);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><span></span>';
    toast.querySelector('span').textContent = message;
    region.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('is-leaving');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    const infoButton = document.getElementById('infoButton');
    const infoModalOverlay = document.getElementById('infoModalOverlay');
    const infoModalClose = document.getElementById('infoModalClose');

    const helpButton = document.getElementById('helpButton');
    const helpDropdown = document.getElementById('helpDropdown');
    const helpAcercaDe = document.getElementById('helpAcercaDe');

    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    const activityButton = document.getElementById('activityButton');
    const activitySheet = document.getElementById('activitySheet');
    const activityOverlay = document.getElementById('activityOverlay');
    const activityClose = document.getElementById('activityClose');
    const activityClear = document.getElementById('activityClear');
    const activityList = document.getElementById('activityList');
    const activityEmpty = document.getElementById('activityEmpty');
    const activityBadge = document.getElementById('activityBadge');

    // Menú móvil
    menuToggle?.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Modal de información
    const openInfoModal = () => infoModalOverlay?.classList.add('is-open');
    const closeInfoModal = () => infoModalOverlay?.classList.remove('is-open');

    if (infoButton && infoModalOverlay) {
        infoButton.addEventListener('click', openInfoModal);
        infoModalClose.addEventListener('click', closeInfoModal);

        // Cerrar al hacer clic fuera de la tarjeta del modal
        infoModalOverlay.addEventListener('click', (e) => {
            if (e.target === infoModalOverlay) closeInfoModal();
        });
    }

    // Panel lateral de actividades
    const openActivity = () => {
        activitySheet.classList.add('is-open');
        activityOverlay.classList.add('is-open');
        activitySheet.setAttribute('aria-hidden', 'false');
    };
    const closeActivity = () => {
        activitySheet?.classList.remove('is-open');
        activityOverlay?.classList.remove('is-open');
        activitySheet?.setAttribute('aria-hidden', 'true');
    };

    if (activityButton && activitySheet) {
        activityButton.addEventListener('click', openActivity);
        activityClose.addEventListener('click', closeActivity);
        activityOverlay.addEventListener('click', closeActivity);

        activityClear.addEventListener('click', () => {
            activityList.innerHTML = '';
            activityEmpty.hidden = false;
            activityBadge.hidden = true;
            activityClear.disabled = true;
        });
    }

    // Menú de ayuda
    if (helpButton && helpDropdown) {
        helpButton.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown?.classList.remove('is-open');
            helpDropdown.classList.toggle('is-open');
        });

        // "Acerca de WorkPlace" abre el modal de información
        helpAcercaDe?.addEventListener('click', (e) => {
            e.preventDefault();
            helpDropdown.classList.remove('is-open');
            openInfoModal();
        });
    }

    // Menú de perfil
    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            helpDropdown?.classList.remove('is-open');
            profileDropdown.classList.toggle('is-open');
        });
    }

    // Cerrar los menús al hacer clic en cualquier parte fuera de ellos
    document.addEventListener('click', (e) => {
        if (helpDropdown && !helpDropdown.contains(e.target)) {
            helpDropdown.classList.remove('is-open');
        }
        if (profileDropdown && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('is-open');
        }
    });

    // Cerrar todo con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeInfoModal();
            closeActivity();
            helpDropdown?.classList.remove('is-open');
            profileDropdown?.classList.remove('is-open');
        }
    });

    // Formularios y botones con data-toast muestran una confirmación
    document.querySelectorAll('form[data-toast]').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast(form.dataset.toast);
            form.reset();
        });
    });

    document.querySelectorAll('button[data-toast]').forEach((button) => {
        button.addEventListener('click', () => showToast(button.dataset.toast));
    });
});
