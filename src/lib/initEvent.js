import { EventoLlegadaAuto } from './carArriveEvent';
import { insertarEvento } from './utils';

export class EventoInicializacion {
  constructor(tiempoActual) {
    this.tiempoDeSiguienteOcurrencia = 0;
    this.rndLlegada = Math.random();
    this.tiempoEntreLlegadas = 12 + this.rndLlegada * (14 - 12);
    this.proximaLlegada = tiempoActual + this.tiempoEntreLlegadas;
    this.tiempoActual = tiempoActual;
  }

  ocurreEvento(datos) {
    insertarEvento(datos.colaEventos, new EventoLlegadaAuto(this.rndLlegada, this.tiempoEntreLlegadas, this.tiempoActual));
    this.tiempoActual = this.proximaLlegada;
  }
}