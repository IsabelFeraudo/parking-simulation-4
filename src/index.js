import { CANTIDAD_DE_FILAS_A_SIMULAR } from './components/SimulacionFormulario'

class TrabajoPractico {
  constructor(stockInicial, cantidadFilasASimular) {
    this.STOCK_INICIAL = stockInicial
    this.CANTIDAD_DE_FILAS_A_SIMULAR = cantidadFilasASimular
    this.resultados = []
    this.cantidadLlegadasClientes = 0 // Contador para la cantidad total de llegadas de clientes
    this.porcentajeClientesTristes = 0
  }

  comenzarEjecucion() {
    const datos = {
      colaEventos: [],
      empleadosLibres: 2,
      colaClientes: [],
      stock: this.STOCK_INICIAL,
      clientes: 0,
      clientesTristes: 0,
    }

    this.inicializarEventos(datos)

    for (let fila = 1; fila < this.CANTIDAD_DE_FILAS_A_SIMULAR; fila++) {
      const eventoInminente = this.encontrarEventoMasProximo(datos)

      eventoInminente.ocurreEvento(datos)

      const filaDatos = {
        tiempo: eventoInminente.tiempo,
        evento: eventoInminente.constructor.name,
        nroCliente: eventoInminente.nroCliente,
        stock: datos.stock,
        empleadosLibres: datos.empleadosLibres,
        colaClientes: [...datos.colaClientes],
        eventosCola: datos.colaEventos.map(evento => ({
          tiempo: evento.tiempo,
          evento: evento.constructor.name,
          nroCliente: evento.nroCliente,
        })),
      }

      if (fila >= this.FILA_A_SIMULAR_DESDE && fila < this.FILA_A_SIMULAR_DESDE + this.CANTIDAD_FILAS_A_MOSTRAR) {
        this.resultados.push({ ...filaDatos, nroFila: fila })
      }
    }
  }

  encontrarEventoMasProximo(datos) {
    const eventoEncontrado = datos.colaEventos.reduce(
      (eventoMinimo, evento) => (evento.tiempo < eventoMinimo.tiempo ? evento : eventoMinimo),
      datos.colaEventos[0]
    )

    datos.colaEventos = datos.colaEventos.filter(evento => evento !== eventoEncontrado)

    return eventoEncontrado
  }

  inicializarEventos(datos) {
    datos.colaEventos.push(new LlegadaCliente(0, 1))

    if (datos.stock === 0) {
      datos.colaEventos.push(new FinCoccionHorno(0, 0))
    } else {
      datos.colaEventos.push(new EncendidoHorno45Minutos(0))
    }
  }

  getResultados() {
    return this.resultados
  }
}





export default TrabajoPractico