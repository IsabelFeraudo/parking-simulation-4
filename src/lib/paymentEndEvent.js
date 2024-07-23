export class EventoFinCobro {
  constructor(tiempoActual, auto) {
    this.tiempoDeSiguienteOcurrencia = tiempoActual + 2
    this.auto = auto
  }

  ocurreEvento(datos) {
    datos.cantAutosPagaron += 1
    datos.acumuladorPlata += this.auto.costo

    let indice = datos.autosIngresados.findIndex(auto => auto.id === this.auto.id)
    // Si se encuentra el objeto, eliminarlo del arreglo (-1 significa que no encontro nada)
    if (indice !== -1) {
      datos.autosIngresados.splice(indice, 1)
    }
    if (datos.filaCaja.length > 0) {
      const proximoAuto = datos.filaCaja.shift() // saca el primero de la fila
      datos.colaEventos.push(new EventoFinCobro(this.tiempoDeSiguienteOcurrencia, proximoAuto))
    } else {
      datos.cajaOcupada = false
    }
  }
}