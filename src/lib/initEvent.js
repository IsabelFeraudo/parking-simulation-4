import { EventoLlegadaAuto } from './carArriveEvent';

export class EventoInicializacion {
  constructor(tiempoActual) {
    this.tiempoDeSiguienteOcurrencia = 0;
    this.rndLlegada = Math.random();
    this.tiempoEntreLlegadas = 12 + this.rndLlegada * (14 - 12);
    this.proximaLlegada = tiempoActual + this.tiempoEntreLlegadas;
    this.tiempoActual = tiempoActual;
  }

  ocurreEvento(datos) {
    this._insertarEvento(datos.colaEventos, new EventoLlegadaAuto(this.rndLlegada, this.tiempoEntreLlegadas, this.tiempoActual));
    this.tiempoActual = this.proximaLlegada;
  }

  _insertarEvento(eventosCola, nuevoEvento) {
    // Insertar el nuevo evento en la cola
    eventosCola.push(nuevoEvento);
    // Ordenar la cola de eventos por tiempo de ocurrencia
    eventosCola.sort((a, b) => a.tiempoDeSiguienteOcurrencia - b.tiempoDeSiguienteOcurrencia);
  }
}