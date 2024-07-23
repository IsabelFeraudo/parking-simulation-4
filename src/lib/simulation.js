import { Lugar } from './lugar';
import { EventoInicializacion } from './initEvent';
import { EventoFinEstacionamiento } from './parkingEndEvent';
import { EventoLlegadaAuto } from './carArriveEvent';
import { PARKING_SIZE, PARKING_AVAILABILITY } from './utils/constants';

export default class Simulation {
  constructor(cantidadFilasASimular) {
    this.CANTIDAD_DE_FILAS_A_SIMULAR = cantidadFilasASimular;
    this.resultados = [];
  }

  comenzarEjecucion() {
    const lugaresPequenos = Array.from({ length: 10 }, () => new Lugar(PARKING_SIZE.PEQUENO, PARKING_AVAILABILITY.LIBRES));
    const lugaresGrandes = Array.from({ length: 6 }, () => new Lugar(PARKING_SIZE.GRANDE, PARKING_AVAILABILITY.LIBRES));
    const lugaresUtilitarios = Array.from({ length: 4 }, () => new Lugar(PARKING_SIZE.UTILITARIO, PARKING_AVAILABILITY.LIBRES));

    const datos = {
      idAuto: 0,
      tiempoActual: 0,
      lugaresDeEstacionamiento: [...lugaresPequenos, ...lugaresGrandes, ...lugaresUtilitarios],
      autosIngresados: [],
      cajaOcupada: false,
      filaCaja: [],
      cantAutosIngresados: 0,
      cantAutosPagaron: 0,
      acumuladorPlata: 0,
      colaEventos: [],
      tiempoEntreLlegadas: 0,
      rndLlegada: 0,
      rndProximaLlegada: 0,
      ProximotiempoEntreLlegadas: 0,
      proximaLlegada: 0,
      rndtamano: 0,
      tamano: 0,
      rndTiempoProxFinEstacionamiento: 0,
      tiempoDeEstadiaProxFinEstacionamiento: 0,
      tiempoDeOcurrenciaFinEstacionamiento: 0,
      rndFinEstacionamientoActual: 0,
      tiempoDeEstadiaActual: 0,
      tiempoDeOcurrenciaFinEstacionamientoActual: 0,
      tiempoDeLlegada: 0,
      autosFinEstacionamiento: [],
      rndProximoFinEstacionamiento: 0,
    };

    this.inicializarEventos(datos);

    for (let fila = 0; fila < this.CANTIDAD_DE_FILAS_A_SIMULAR; fila++) {
      const eventoProximo = this.extraerEventoProximo(datos);

      eventoProximo.ocurreEvento(datos);

      const utilitariosParcialmenteLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.parking_size === PARKING_SIZE.UTILITARIO && lugar.ocupados === PARKING_AVAILABILITY.PARCIALMENTE_LIBRES
      ).length;
      const utilitariosLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.parking_size === PARKING_SIZE.UTILITARIO && lugar.ocupados === PARKING_AVAILABILITY.LIBRES
      ).length;
      const grandesLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.parking_size === PARKING_SIZE.GRANDE && lugar.ocupados === PARKING_AVAILABILITY.LIBRES
      ).length;
      const pequeñosLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.parking_size === PARKING_SIZE.PEQUENO && lugar.ocupados === PARKING_AVAILABILITY.LIBRES
      ).length;

      const autos = datos.autosIngresados.map(auto => {
        return { id: auto.id, estado: auto.estado, tamano: auto.tamano };
      });
      const filaCaja = datos.filaCaja.map(auto => {
        return { id: auto.id };
      });
      const colaEventos = datos.colaEventos.map(evento => {
        return { nombre: evento.constructor.name, tiempo: evento.tiempoDeSiguienteOcurrencia };
      });

      // Aquí es donde añadimos el mapeo de autosFinEstacionamiento
      const autosFinEstacionamiento = datos.autosFinEstacionamiento.map(finEstacionamiento => {
        return {
          tiempoDeEstadiaActual: finEstacionamiento.tiempoDeEstadiaActual,
          tiempoDeLlegada: finEstacionamiento.tiempoDeLlegada,
          tiempoDeOcurrenciaFinEstacionamientoActual: finEstacionamiento.tiempoDeOcurrenciaFinEstacionamientoActual,
          auto: {
            id: finEstacionamiento.auto.id,
            estado: finEstacionamiento.auto.estado,
            tamano: finEstacionamiento.auto.tamano
          }
        };
      });

      if (eventoProximo.tiempoDeSiguienteOcurrencia > this.CANTIDAD_DE_FILAS_A_SIMULAR * 60) {
        break;
      }

      const filaDatos = {
        evento: eventoProximo.constructor.name,
        idAuto: eventoProximo.auto?.id || ' ', // Obtenemos idAuto si existe
        tiempoActual: eventoProximo.tiempoDeSiguienteOcurrencia,
        estadoCajero: datos.cajaOcupada ? 'ocupada' : 'libre',
        filaCaja: [...datos.filaCaja],
        utilitariosParcialmenteLibres: utilitariosParcialmenteLibres,
        utilitariosLibres: utilitariosLibres,
        grandesLibres: grandesLibres,
        pequeñosLibres: pequeñosLibres,
        autos: autos,
        eventosCola: colaEventos,
        autosFinEstacionamiento: [...datos.autosFinEstacionamiento],
        acumuladorPlata: datos.acumuladorPlata,
        cantAutosIngresados: datos.cantAutosIngresados,
        cantAutosPagaron: datos.cantAutosPagaron,
        proximaLlegada: eventoProximo.proximaLlegada || null,
        rndProximaLlegada: eventoProximo.rndProximaLlegada,
        ProximotiempoEntreLlegadas: eventoProximo.ProximotiempoEntreLlegadas,
        proximaLlegada: eventoProximo.proximaLlegada,
        rndtamano: eventoProximo.rndtamano,
        tamano: eventoProximo.tamano,
        //rndTiempoProxFinEstacionamiento: eventoProximo.rndTiempoProxFinEstacionamiento,
        //tiempoDeEstadiaProxFinEstacionamiento: eventoProximo.tiempoDeEstadiaProxFinEstacionamiento,
        //tiempoDeOcurrenciaFinEstacionamiento: eventoProximo.tiempoDeOcurrenciaFinEstacionamiento,
        //rndFinEstacionamientoActual: eventoProximo.rndFinEstacionamientoActual,
        //tiempoDeEstadiaActual: eventoProximo.tiempoDeEstadiaActual,
        //tiempoDeOcurrenciaFinEstacionamientoActual: eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual,
        tiempoDeLlegada: eventoProximo.tiempoDeLlegada,
        idFila: fila,
        //rndProximoFinEstacionamiento:eventoProximo.rndProximoFinEstacionamiento,
      };

      if (eventoProximo instanceof EventoFinEstacionamiento) {
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.idAuto = eventoProximo.auto.id; // Obtener el número de auto
        // Evento cobro
        filaDatos.tCobro = 2; // Asumiendo que tCobro es una constante
        filaDatos.finCobro = eventoProximo.finCobro; // Obtener el tiempo de cobro
      }

      if (eventoProximo instanceof EventoLlegadaAuto) {
        filaDatos.idAuto = eventoProximo.auto.id; // Accede al número de auto correctamente
        filaDatos.tiempoActual = eventoProximo.tiempoActual;
        filaDatos.rndProximaLlegada = eventoProximo.rndProximaLlegada;
        filaDatos.ProximotiempoEntreLlegadas = eventoProximo.ProximotiempoEntreLlegadas;
        filaDatos.proximaLlegada = eventoProximo.tiempoDeSiguienteOcurrencia;
        filaDatos.rndtamano = eventoProximo.rndtamano;
        filaDatos.tamano = eventoProximo.tamano;
        // Crea EventoFinEstacionamiento
        filaDatos.rndProximoFinEstacionamiento = eventoProximo.rndProximoFinEstacionamiento;
        filaDatos.tiempoDeEstadiaProxFinEstacionamiento = eventoProximo.tiempoDeEstadia;
        filaDatos.tiempoDeLlegada = eventoProximo.tiempoActual; // Ajuste necesario
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamiento;
      }

      if (eventoProximo instanceof EventoFinEstacionamiento) {
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.idAuto = eventoProximo.auto.id; // Obtener el número de auto
      }

      if (eventoProximo instanceof EventoInicializacion) {
        filaDatos.tiempoActual = datos.tiempoActual;
        filaDatos.ProximotiempoEntreLlegadas = eventoProximo.tiempoEntreLlegadas;
        filaDatos.rndProximaLlegada = eventoProximo.rndLlegada;
        filaDatos.proximaLlegada = eventoProximo.proximaLlegada;
      }

      if (fila >= this.FILA_A_SIMULAR_DESDE && fila < this.FILA_A_SIMULAR_DESDE + this.CANTIDAD_FILAS_A_MOSTRAR) {
        this.resultados.push({ ...filaDatos, idFila: fila });
      }
      datos.tiempoActual = eventoProximo.tiempoDeSiguienteOcurrencia; // Actualiza el tiempo al tiempo de ocurrencia del evento
    }
  }

  inicializarEventos(datos) {
    datos.colaEventos.push(new EventoInicializacion(0));
  }

  extraerEventoProximo(datos) {
    let eventoMasCercano = datos.colaEventos[0];

    datos.colaEventos.forEach(evento => {
      if (evento.tiempoDeSiguienteOcurrencia < eventoMasCercano.tiempoDeSiguienteOcurrencia) {
        eventoMasCercano = evento;
      }
    });
    let indice = datos.colaEventos.findIndex(
      evento => evento.tiempoDeSiguienteOcurrencia === eventoMasCercano.tiempoDeSiguienteOcurrencia
    );
    if (indice !== -1) {
      datos.colaEventos.splice(indice, 1);
    }
    return eventoMasCercano;
  }

  getResultados() {
    return this.resultados;
  }
}