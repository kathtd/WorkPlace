// Importo useState para que el componente recuerde datos que cambian
import { useState } from 'react';
// Importo la tarjeta que dibuja cada vacante
import TarjetaVacante from './TarjetaVacante.jsx';

// Componente principal: recibe la lista de vacantes por props
function VacantesLista({ vacantes }) {
  // Texto que la persona escribe en el buscador (empieza vacío)
  const [busqueda, setBusqueda] = useState('');
  // Modalidad elegida en el filtro ("Todas" no filtra nada)
  const [modalidad, setModalidad] = useState('Todas');
  // Ids de las vacantes guardadas (empieza sin ninguna)
  const [guardadas, setGuardadas] = useState([]);

  // Guarda o quita una vacante según su id
  function alternarGuardada(id) {
    // Si el id ya está en la lista de guardadas
    if (guardadas.includes(id)) {
      // La quito dejando todas las demás
      setGuardadas(guardadas.filter((guardada) => guardada !== id));
    } else {
      // Si no estaba, la agrego al final
      setGuardadas([...guardadas, id]);
    }
  }

  // Paso lo escrito a minúsculas para buscar sin importar mayúsculas
  const texto = busqueda.toLowerCase();
  // Me quedo solo con las vacantes que cumplen la búsqueda y la modalidad
  const filtradas = vacantes.filter((vacante) => {
    // Busca el texto en el cargo o en el nombre de la empresa
    const coincideTexto = vacante.titulo.toLowerCase().includes(texto) || vacante.empresa.toLowerCase().includes(texto);
    // Es verdadero si no hay filtro o si la modalidad es la elegida
    const coincideModalidad = modalidad === 'Todas' || vacante.modalidad === modalidad;
    // La vacante pasa solo si cumple las dos condiciones
    return coincideTexto && coincideModalidad;
  });

  // Devuelvo lo que se va a mostrar en pantalla
  return (
    // Sección que envuelve todo el componente
    <section className="vacantes">
      {/* Título de la página */}
      <h1>Vacantes en WorkPlace</h1>
      {/* Contenedor del buscador y del filtro */}
      <div className="filtros">
        {/* Cuadro de texto: su valor viene del estado y se actualiza al escribir */}
        <input type="search" placeholder="Busca por cargo o empresa" aria-label="Buscar vacante" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        {/* Lista desplegable para filtrar por modalidad */}
        <select aria-label="Filtrar por modalidad" value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
          {/* Opción que muestra todas las vacantes */}
          <option value="Todas">Todas las modalidades</option>
          {/* Solo vacantes presenciales */}
          <option value="Presencial">Presencial</option>
          {/* Solo vacantes remotas */}
          <option value="Remoto">Remoto</option>
          {/* Solo vacantes híbridas */}
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>
      {/* Contador de resultados y de vacantes guardadas */}
      <p className="resumen">{filtradas.length} vacantes encontradas · {guardadas.length} guardadas</p>
      {/* Si no hay resultados muestro un aviso; si hay, muestro las tarjetas */}
      {filtradas.length === 0 ? (
        // Mensaje cuando el filtro no encuentra nada
        <p className="vacio">No encontramos vacantes con esos filtros.</p>
      ) : (
        // Contenedor en cuadrícula de las tarjetas
        <div className="cuadricula">
          {/* Recorro las vacantes filtradas y dibujo una tarjeta por cada una */}
          {filtradas.map((vacante) => (
            // key es el id único; guardada dice si está en la lista; alGuardar es la función del botón
            <TarjetaVacante key={vacante.id} vacante={vacante} guardada={guardadas.includes(vacante.id)} alGuardar={alternarGuardada} />
          ))}
        </div>
      )}
    </section>
  );
}

// Exporto el componente para usarlo en App.jsx
export default VacantesLista;
