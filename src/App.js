import React, { useState } from 'react';
import DataTable from './components/DataTable.js';
import SimForm from './components/SimForm.js';
import Simulation from './Simulation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [datos, setDatos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalAutosPagaron: 0,
    totalRecaudacion: 0,
    gananciaPromedio: 0,
  });

  const handleSimulation = formValues => {
    const { cantidadFilasASimular, filaASimularDesde, cantidadFilasAMostrar,cantidadHorasASimular, mostrarDesdeHora,mostrarHastaHora } = formValues;
    const sim = new Simulation();
    sim.CANTIDAD_DE_FILAS_A_SIMULAR = cantidadFilasASimular;
    sim.FILA_A_SIMULAR_DESDE = filaASimularDesde;
    sim.CANTIDAD_FILAS_A_MOSTRAR = cantidadFilasAMostrar;
    sim.CANTIDAD_DE_HORAS_A_SIMULAR= cantidadHorasASimular;
    sim.MOSTRAR_DESDE_HORA=mostrarDesdeHora;
    sim.MOSTRAR_HASTA_HORA=mostrarHastaHora;
    sim.comenzarEjecucion();

    // Obtener resultados de la simulación
    const resultados = sim.getResultados();
    setDatos(resultados);

    // Calcular estadísticas
    const totalAutosPagaron = sim.getTotalAutosPagaron();
    const totalRecaudacion = sim.getTotalRecaudacion();
    const gananciaPromedio = totalAutosPagaron > 0 ? totalRecaudacion / totalAutosPagaron : 0;

    console.log("VARIABLES ESTADISTICAS", totalAutosPagaron, totalRecaudacion);
    setEstadisticas({
      totalAutosPagaron,
      totalRecaudacion,
      gananciaPromedio,
    });
  };

  return (
    <div className="App">
      <h1>Simulación de Estacionamiento</h1>
      <SimForm onSubmit={handleSimulation} />
      {datos.length > 0 && (
        <div>
          <h2>Resultados de la Simulación</h2>
          <p>Total de autos que pagaron: {estadisticas.totalAutosPagaron}</p>
          <p>Recaudación total: ${estadisticas.totalRecaudacion.toFixed(2)}</p>
          <p>Ganancia promedio por auto: ${estadisticas.gananciaPromedio.toFixed(2)}</p>
          <DataTable data={datos} />
        </div>
      )}
    </div>
  );
}

export default App;