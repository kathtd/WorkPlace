// Comportamiento común a todas las páginas: service worker, menú móvil, menús
// desplegables, panel de actividades, modal de información, datos del perfil
// y notificaciones. Depende de js/store.js.

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
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        document.body.appendChild(region);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span></span>';
    toast.querySelector('span').textContent = message;
    region.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('is-leaving');
        toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
}

// Rellena los elementos con data-profile="nombre|email|telefono|ciudad|rol|initials"
function refreshProfile() {
    const perfil = Store.getPerfil();
    document.querySelectorAll('[data-profile]').forEach((el) => {
        const campo = el.dataset.profile;
        if (campo !== 'initials') {
            el.textContent = perfil[campo] ?? '';
            return;
        }
        if (perfil.foto) {
            el.innerHTML = `<img src="${perfil.foto}" alt="">`;
        } else {
            el.textContent = Formato.iniciales(perfil.nombre);
        }
    });
}

// Mantiene el foco del teclado dentro de un diálogo abierto y lo devuelve al cerrarlo
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let dialogoAbierto = null;
let focoAnterior = null;

function abrirDialogo(contenedor) {
    focoAnterior = document.activeElement;
    dialogoAbierto = contenedor;
    contenedor.querySelector(FOCUSABLE)?.focus();
}

function cerrarDialogo() {
    dialogoAbierto = null;
    focoAnterior?.focus();
    focoAnterior = null;
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !dialogoAbierto) return;
    const items = Array.from(dialogoAbierto.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

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

    refreshProfile();
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    // Menú móvil
    menuToggle?.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Modal de información
    function openInfoModal() {
        infoModalOverlay.classList.add('is-open');
        abrirDialogo(infoModalOverlay);
    }
    function closeInfoModal() {
        if (!infoModalOverlay?.classList.contains('is-open')) return;
        infoModalOverlay.classList.remove('is-open');
        cerrarDialogo();
    }

    if (infoButton && infoModalOverlay) {
        infoButton.addEventListener('click', openInfoModal);
        infoModalClose.addEventListener('click', closeInfoModal);

        // Cerrar al hacer clic fuera de la tarjeta del modal
        infoModalOverlay.addEventListener('click', (e) => {
            if (e.target === infoModalOverlay) closeInfoModal();
        });
    }

    // Panel lateral de actividades
    function renderActividades() {
        const actividades = Store.getActividades();
        activityList.innerHTML = actividades.map((a) => `<li class="activity">
            <span class="activity__icon activity__icon--${Formato.html(a.color)}"><i class="${Formato.html(a.icono)}" aria-hidden="true"></i></span>
            <div><p class="activity__title">${Formato.html(a.texto)}</p><p class="activity__time">${Formato.haceTiempo(a.fecha)}</p></div>
        </li>`).join('');
        activityEmpty.hidden = actividades.length > 0;
        activityClear.disabled = actividades.length === 0;

        const nuevas = actividades.filter((a) => a.fecha > Store.getActividadesVistas()).length;
        activityBadge.hidden = nuevas === 0;
        activityBadge.textContent = nuevas > 9 ? '9+' : nuevas;
        activityButton.setAttribute('aria-label', nuevas ? `Actividades recientes (${nuevas} nuevas)` : 'Actividades recientes');
    }

    function openActivity() {
        renderActividades();
        Store.marcarActividadesVistas();
        activityBadge.hidden = true;
        activitySheet.classList.add('is-open');
        activityOverlay.classList.add('is-open');
        activitySheet.setAttribute('aria-hidden', 'false');
        abrirDialogo(activitySheet);
    }
    function closeActivity() {
        if (!activitySheet?.classList.contains('is-open')) return;
        activitySheet.classList.remove('is-open');
        activityOverlay.classList.remove('is-open');
        activitySheet.setAttribute('aria-hidden', 'true');
        cerrarDialogo();
    }

    if (activityButton && activitySheet) {
        renderActividades();
        // Cualquier script que registre una actividad actualiza el panel y el contador
        window.addEventListener('workplace:actividades', renderActividades);
        activityButton.addEventListener('click', openActivity);
        activityClose.addEventListener('click', closeActivity);
        activityOverlay.addEventListener('click', closeActivity);
        activityClear.addEventListener('click', () => {
            Store.clearActividades();
            activityClose.focus();
        });
    }

    // Menús desplegables de ayuda y perfil
    const dropdowns = [[helpButton, helpDropdown], [profileButton, profileDropdown]].filter(([b, d]) => b && d);

    function setDropdown(button, dropdown, open) {
        dropdown.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', open);
    }
    const closeDropdowns = () => dropdowns.forEach(([b, d]) => setDropdown(b, d, false));

    dropdowns.forEach(([button, dropdown]) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = !dropdown.classList.contains('is-open');
            closeDropdowns();
            setDropdown(button, dropdown, open);
            if (open) dropdown.querySelector('a')?.focus();
        });
    });

    // "Acerca de WorkPlace" abre el modal de información
    helpAcercaDe?.addEventListener('click', (e) => {
        e.preventDefault();
        closeDropdowns();
        openInfoModal();
    });

    // Cerrar los menús al hacer clic en cualquier parte fuera de ellos
    document.addEventListener('click', (e) => {
        dropdowns.forEach(([button, dropdown]) => {
            if (!dropdown.contains(e.target)) setDropdown(button, dropdown, false);
        });
    });

    // Cerrar todo con la tecla Escape, devolviendo el foco al botón del menú abierto
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        dropdowns.forEach(([button, dropdown]) => {
            if (dropdown.classList.contains('is-open')) {
                setDropdown(button, dropdown, false);
                button.focus();
            }
        });
        closeInfoModal();
        closeActivity();
    });

    // Formularios y botones con data-toast muestran una confirmación;
    // data-activity="texto|icono|color" además la registra en el historial
    const registrar = (el) => {
        if (!el.dataset.activity) return;
        const [texto, icono, color] = el.dataset.activity.split('|');
        Store.logActividad(texto, icono, color);
    };

    document.querySelectorAll('form[data-toast]').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast(form.dataset.toast);
            registrar(form);
            form.reset();
        });
    });

    document.querySelectorAll('button[data-toast]').forEach((button) => {
        button.addEventListener('click', () => {
            showToast(button.dataset.toast);
            registrar(button);
        });
    });
});
