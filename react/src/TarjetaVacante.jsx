// Componente que dibuja una sola vacante; recibe sus datos por props
function TarjetaVacante({ vacante, guardada, alGuardar }) {
  // Convierto el salario a pesos colombianos, por ejemplo $4.500.000
  const formato = (valor) => '$' + valor.toLocaleString('es-CO');

  // Devuelvo el HTML (JSX) que se va a mostrar
  return (
    // Cada tarjeta es un article con su clase para los estilos
    <article className="tarjeta">
      {/* Cargo de la vacante */}
      <h2>{vacante.titulo}</h2>
      {/* Empresa y ciudad separadas por un punto */}
      <p className="empresa">{vacante.empresa} · {vacante.ciudad}</p>
      {/* Rango de salario usando la función de arriba */}
      <p className="salario">{formato(vacante.salarioMin)} - {formato(vacante.salarioMax)}</p>
      {/* Contenedor de las etiquetas */}
      <div className="etiquetas">
        {/* La modalidad (Presencial, Remoto o Híbrido) va como primera etiqueta */}
        <span className="etiqueta etiqueta--modalidad">{vacante.modalidad}</span>
        {/* Recorro las etiquetas de la vacante y creo un span por cada una */}
        {vacante.etiquetas.map((etiqueta) => (
          // key ayuda a React a identificar cada elemento de la lista
          <span key={etiqueta} className="etiqueta">{etiqueta}</span>
        ))}
      </div>
      {/* Botón que cambia de estilo y de texto si la vacante está guardada */}
      <button className={guardada ? 'boton boton--guardada' : 'boton'} onClick={() => alGuardar(vacante.id)}>
        {/* Texto según el estado */}
        {guardada ? 'Guardada' : 'Guardar vacante'}
      </button>
    </article>
  );
}

// Exporto el componente para poder usarlo en otros archivos
export default TarjetaVacante;
