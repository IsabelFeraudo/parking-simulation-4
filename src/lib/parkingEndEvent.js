import { EventoFinCobro } from './paymentEndEvent';
import { PARKING_SIZE } from './utils/constants';

export class EventoFinEstacionamiento {
  constructor(rndFinEstacionamientoActual, tiempoDeEstadiaActual, tiempoDeLlegada, tiempoDeOcurrenciaFinEstacionamientoActual, autoQueLlega) {
    // Valores fin de estacionamiento actual
    this.rndFinEstacionamientoActual = rndFinEstacionamientoActual;
    this.tiempoDeEstadiaActual = tiempoDeEstadiaActual;
    this.tiempoDeLlegada = tiempoDeLlegada;
    this.tiempoDeOcurrenciaFinEstacionamientoActual = tiempoDeOcurrenciaFinEstacionamientoActual;
    this.auto = autoQueLlega;
    this.tiempoDeSiguienteOcurrencia = this.tiempoDeOcurrenciaFinEstacionamientoActual;

    // Calcular el tiempo de cobro
    this.finCobro = this.tiempoDeOcurrenciaFinEstacionamientoActual + 2; // Por ejemplo, 2 unidades de tiempo después del fin de estacionamiento
  }

  ocurreEvento(datos) {
    // Actualizar la ocupación del lugar
    if (this.auto.tamano === PARKING_SIZE.UTILITARIO) {
      this.auto.lugar.ocupados -= 2;
    } else {
      this.auto.lugar.ocupados -= 1;
    }

    // Procesar el pago en la caja
    if (datos.filaCaja.length > 0) {
      this.auto.estado = 'esperando pagar';
      datos.filaCaja.push(this.auto);
    } else {
      if (datos.cajaOcupada) {
        this.auto.estado = 'esperando pagar';
        datos.filaCaja.push(this.auto);
      } else {
        this.auto.estado = 'pagando';
        datos.cajaOcupada = true;
        datos.colaEventos.push(new EventoFinCobro(this.tiempoDeOcurrenciaFinEstacionamientoActual, this.auto));
      }
    }
    // Eliminar el auto de autosFinEstacionamiento
    datos.autosFinEstacionamiento = datos.autosFinEstacionamiento.filter(autoFin => autoFin.auto.id !== this.auto.id);
  }
}