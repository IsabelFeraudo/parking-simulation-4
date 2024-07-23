import { Auto } from './auto';
import { EventoFinEstacionamiento } from './parkingEndEvent';
import { calcularTiempoDeEstadia, tamanoDeAuto } from './utils';
import { PARKING_SIZE, PARKING_AVAILABILITY } from './utils/constants';

export class EventoLlegadaAuto {
  constructor(rndLlegada, tiempoEntreLlegadas, tiempoActual) {
    // Valores de llegada actual
    this.rndLlegadaActual = rndLlegada;
    this.tiempoEntreLlegadasActual = tiempoEntreLlegadas;
    this.tiempoActual = tiempoActual;

    // Evento Próxima llegada
    this.rndProximaLlegada = Math.random();
    this.ProximotiempoEntreLlegadas = 12 + this.rndProximaLlegada * (14 - 12);
    this.tiempoDeSiguienteOcurrencia = tiempoActual + this.tiempoEntreLlegadasActual;

    // Evento FinEstacionamiento
    this.rndProximoFinEstacionamiento = Math.random();
    this.tiempoDeEstadia = calcularTiempoDeEstadia(this.rndProximoFinEstacionamiento);
    this.tiempoDeOcurrenciaFinEstacionamiento = tiempoActual + this.tiempoDeEstadia;
  }

  ocurreEvento(datos) {
    this.rndtamano = Math.random();
    this.tamano = tamanoDeAuto(this.rndtamano);

    const autoQueLlega = new Auto(this.tamano);
    // Lógica de estacionamiento (sin cambios)
    if (autoQueLlega.tamano === PARKING_SIZE.GRANDE) {
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.parking_size === PARKING_SIZE.GRANDE && lugarEstacionamiento.ocupados === PARKING_AVAILABILITY.LIBRES) {
          lugarEstacionamiento.ocupados += 1;
          autoQueLlega.lugar = lugarEstacionamiento;
          break;
        }
      }
    } else if (autoQueLlega.tamano === PARKING_SIZE.UTILITARIO) {
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.parking_size === PARKING_SIZE.UTILITARIO && lugarEstacionamiento.ocupados === PARKING_AVAILABILITY.LIBRES) {
          lugarEstacionamiento.ocupados += 2;
          autoQueLlega.lugar = lugarEstacionamiento;
          break;
        }
      }
    } else if (autoQueLlega.tamano === PARKING_SIZE.PEQUENO) {
      let encontroLugar = false;
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.parking_size === PARKING_SIZE.PEQUENO && lugarEstacionamiento.ocupados === PARKING_AVAILABILITY.LIBRES) {
          lugarEstacionamiento.ocupados += 1;
          autoQueLlega.lugar = lugarEstacionamiento;
          encontroLugar = true;
          break;
        }
      }
      if (!encontroLugar) {
        for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
          const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
          if (lugarEstacionamiento.parking_size === PARKING_SIZE.UTILITARIO && lugarEstacionamiento.ocupados < 2) {
            lugarEstacionamiento.ocupados += 1;
            autoQueLlega.lugar = lugarEstacionamiento;
            break;
          }
        }
      }
    }

    this.auto = autoQueLlega;
    if (autoQueLlega.lugar) {
      datos.idAuto += 1;

      autoQueLlega.estado = 'estacionado';
      autoQueLlega.id = datos.idAuto;
      datos.cantAutosIngresados += 1;
      datos.autosIngresados.push(autoQueLlega);
      // Agregar el auto a autosFinEstacionamiento
      datos.autosFinEstacionamiento.push({
        tiempoDeEstadiaActual: this.tiempoDeEstadia,
        tiempoDeLlegada: this.tiempoActual,
        tiempoDeOcurrenciaFinEstacionamientoActual: this.tiempoDeOcurrenciaFinEstacionamiento,
        auto: {
          id: this.auto.id,
          estado: this.auto.estado,
          tamano: this.auto.tamano
        }
      });
      datos.colaEventos.push(new EventoFinEstacionamiento(this.rndProximoFinEstacionamiento, this.tiempoDeEstadiaActual, this.tiempoActual, this.tiempoDeOcurrenciaFinEstacionamiento, autoQueLlega));
    }
    datos.colaEventos.push(new EventoLlegadaAuto(this.rndProximaLlegada, this.ProximotiempoEntreLlegadas, this.tiempoDeSiguienteOcurrencia));
  }
}