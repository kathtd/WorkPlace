const API = 'api';
const CLAVE_TOKEN = 'workplace_token';

const vistas = {
  login: document.getElementById('vista-login'),
  registro: document.getElementById('vista-registro'),
  perfil: document.getElementById('vista-perfil'),
};

function mostrar(nombre) {
  Object.keys(vistas).forEach((k) => { vistas[k].hidden = k !== nombre; });
}

function mostrarAlerta(id, texto) {
  const alerta = document.getElementById(id + '-alerta');
  document.getElementById(id + '-mensaje').textContent = texto || '';
  alerta.hidden = !texto;
}

async function pedir(ruta, opciones = {}) {
  const token = sessionStorage.getItem(CLAVE_TOKEN);
  const cabeceras = { 'Content-Type': 'application/json' };
  if (token) cabeceras.Authorization = 'Bearer ' + token;
  const resp = await fetch(API + ruta, { ...opciones, headers: cabeceras });
  return { estado: resp.status, datos: await resp.json() };
}

function mostrarPerfil(u) {
  document.getElementById('perfil-titulo').textContent = 'Bienvenido, ' + u.nombres;
  const etiquetas = [['Documento', u.documento], ['Nombre', u.nombres + ' ' + u.apellidos],
    ['Correo', u.correo], ['Teléfono', u.telefono]];
  const lista = document.getElementById('perfil-datos');
  lista.innerHTML = '';
  etiquetas.forEach(([k, v]) => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = k;
    dd.textContent = v;
    lista.append(dt, dd);
  });
  mostrar('perfil');
}

document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarAlerta('login', '');
  try {
    const { estado, datos } = await pedir('/login', {
      method: 'POST',
      body: JSON.stringify({
        correo: document.getElementById('login-correo').value,
        clave: document.getElementById('login-clave').value,
      }),
    });
    if (estado !== 200) {
      mostrarAlerta('login', datos.mensaje);
      return;
    }
    sessionStorage.setItem(CLAVE_TOKEN, datos.token);
    document.getElementById('login-clave').value = '';
    mostrarPerfil(datos.usuario);
  } catch (err) {
    mostrarAlerta('login', 'No pudimos conectarnos con el servidor.');
  }
});

const CAMPOS = ['documento', 'nombres', 'apellidos', 'correo', 'telefono', 'clave'];

document.getElementById('form-registro').addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarAlerta('registro', '');
  CAMPOS.forEach((c) => { document.getElementById('e-' + c).hidden = true; });
  const cuerpo = {};
  CAMPOS.forEach((c) => { cuerpo[c] = document.getElementById('r-' + c).value; });
  try {
    const { estado, datos } = await pedir('/registro', { method: 'POST', body: JSON.stringify(cuerpo) });
    if (estado === 201) {
      document.getElementById('form-registro').reset();
      document.getElementById('form-login').reset();
      document.getElementById('login-correo').value = datos.usuario.correo;
      mostrar('login');
      document.getElementById('login-clave').focus();
      return;
    }
    if (datos.errores) {
      Object.keys(datos.errores).forEach((c) => {
        const p = document.getElementById('e-' + c);
        p.textContent = datos.errores[c];
        p.hidden = false;
      });
    }
    mostrarAlerta('registro', datos.errores ? 'Revisa los campos marcados.' : datos.mensaje);
  } catch (err) {
    mostrarAlerta('registro', 'No pudimos conectarnos con el servidor.');
  }
});

document.getElementById('btn-salir').addEventListener('click', async () => {
  try {
    await pedir('/logout', { method: 'POST' });
  } catch (err) {
    // Aunque falle, se borra el token del navegador
  }
  sessionStorage.removeItem(CLAVE_TOKEN);
  mostrar('login');
});

document.querySelectorAll('[data-ir]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    mostrar(a.dataset.ir);
  });
});

// Si ya había una sesión abierta, se muestra el perfil
(async function iniciar() {
  if (!sessionStorage.getItem(CLAVE_TOKEN)) return;
  try {
    const { estado, datos } = await pedir('/perfil');
    if (estado === 200) {
      mostrarPerfil(datos.usuario);
    } else {
      sessionStorage.removeItem(CLAVE_TOKEN);
    }
  } catch (err) {
    sessionStorage.removeItem(CLAVE_TOKEN);
  }
})();
