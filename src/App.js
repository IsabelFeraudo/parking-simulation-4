import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react'

import DataTable from './components/DataTable.js'
import SimForm from './components/SimForm.js'

import Simulation from './lib/simulation'

function App() {
  const [datos, setDatos] = useState([])

  const handleSimulation = formValues => {
    const { cantidadFilasASimular, filaASimularDesde, cantidadFilasAMostrar } = formValues

    const sim = new Simulation()

    sim.CANTIDAD_DE_FILAS_A_SIMULAR = cantidadFilasASimular
    sim.FILA_A_SIMULAR_DESDE = filaASimularDesde
    sim.CANTIDAD_FILAS_A_MOSTRAR = cantidadFilasAMostrar
  
    sim.comenzarEjecucion()

    const resultados = sim.getResultados()
    setDatos(resultados)
  }
  
  return (
    <div className="App">
      <h1>Simulación de Estacionamiento</h1>
      <SimForm onSubmit={handleSimulation} />
      {datos.length > 0 && <DataTable data={datos} />}
    </div>
  )
}

export default App