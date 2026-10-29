// Importo el componente de la lista de vacantes
import VacantesLista from './VacantesLista.jsx';
// Importo los datos de las vacantes
import vacantes from './vacantes.js';

// Componente raíz de la aplicación
function App() {
  // Muestro la lista y le paso las vacantes por props
  return <VacantesLista vacantes={vacantes} />;
}

// Exporto App para usarlo en main.jsx
export default App;
