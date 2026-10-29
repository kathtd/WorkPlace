// Importo React para poder usar JSX
import React from 'react';
// Importo createRoot, que conecta React con la página
import { createRoot } from 'react-dom/client';
// Importo el componente raíz
import App from './App.jsx';
// Importo los estilos de la aplicación
import './estilos.css';

// Busco el div con id "root" del index.html y dibujo ahí la aplicación
createRoot(document.getElementById('root')).render(
  // StrictMode avisa de errores comunes mientras se desarrolla
  <React.StrictMode>
    {/* Aquí empieza la aplicación */}
    <App />
  </React.StrictMode>
);
