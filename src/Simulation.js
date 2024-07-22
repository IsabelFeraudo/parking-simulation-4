// import { CANTIDAD_DE_FILAS_A_SIMULAR, CANTIDAD_HORAS_A_SIMULAR } from './components/SimulacionFormulario'

// lugaresDeEstacionamiento = [
//    { tipo: utilitario, ocupados: 0 },
//    { tipo: utilitario, ocupados: 0 },
//    { tipo: peque, ocupados: 0 }
// ]

// FinDeEstadia: auto35
// auto35 = { tamaño: peque, lugar: Lugar1{ tipo: utilitario, ocupados: 1 } }
// auto36 = { tamaño: peque, lugar: Lugar1{ tipo: utilitario, ocupados: 2 } }
//
// auto35 = { tamaño: peque, lugar: { tipo: utilitario, ocupados: 0 } }
//
// auto35 = { tamaño: peque, lugar: null }

// LlegadaVehiculo: auto36
// auto36 = { tamaño: utilitario, lugar: { tipo: utilitario, ocupados: 0 }, }

// auto35 = { tamaño: peque, lugar: null }

//NOTAS:
//NUNCA HAY UTILITARIOS PARCIALMENTE LIBRES
//NO SE MUESTRAN LOS ACUMULADORES
//MANTENER ID DE EVENTOS, TRAZABILIDAD

const CANTIDAD_DE_FILAS_A_SIMULAR = 100
const CANTIDAD_HORAS_A_SIMULAR = 10000

class Auto {
  constructor(tamanoActual, nro, estado, lugar, costo) {
    this.nro = nro
    this.tamanoActual = tamanoActual // pequeño
    this.estado = estado // estacionado, esperando pagar, pagando
    this.lugar = lugar // { tipo: grande }
    this.costo = costo
  }
}

class Lugar {
  constructor(tamanoActual, ocupados) {
    this.tamanoActual = tamanoActual // grande, pequeño, utilitario
    this.ocupados = ocupados // 0, 1, 2
  }
}

class Simulation {
  constructor(stockInicial, cantidadFilasASimular) {
    this.CANTIDAD_DE_FILAS_A_SIMULAR = cantidadFilasASimular;
    this.resultados = [];
  }

  mostrarDatos(evento, datos) {
    const utilitariosParcialmenteLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.tamanoActual === 'utilitario' && lugar.ocupados === 1
    ).length;
    const utilitariosLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.tamanoActual === 'utilitario' && lugar.ocupados === 0
    ).length;
    const utilitariosOcupados = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.tamanoActual === 'utilitario' && lugar.ocupados === 2
    ).length;
    const grandesLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.tamanoActual === 'grande' && lugar.ocupados === 0
    ).length;
    const grandesOcupados = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.tamanoActual === 'grande' && lugar.ocupados === 1
    ).length;
    const pequeñosLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.tamanoActual === 'pequeño' && lugar.ocupados === 0
    ).length;
    const pequeñosOcupados = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.tamanoActual === 'pequeño' && lugar.ocupados === 1
    ).length;
    const autos = datos.autosIngresados.map(auto => {
      return { nro: auto.nro, estado: auto.estado };
    });
    const filaCaja = datos.filaCaja.map(auto => {
      return { nro: auto.nro };
    });
    const colaEventos = datos.colaEventos.map(evento => {
      return { nombre: evento.constructor.name, tiempo: evento.tiempoDeOcurrencia };
    });

    console.log(
      `${evento.constructor.name} - t: ${evento.tiempoActual} \nProximos Eventos: ${JSON.stringify(
        colaEventos
      )} \nAutos Ingresados: ${JSON.stringify(autos)} \nCaja Ocupada: ${
        datos.cajaOcupada
      } - Fila en Caja: ${JSON.stringify(
        filaCaja
      )}\nLugares Utilitarios Parcialmente Libres: ${utilitariosParcialmenteLibres} - Lugares Utilitarios Libres: ${utilitariosLibres} - Lugares Utilitarios Ocupados: ${utilitariosOcupados} - Lugares Grandes Libres: ${grandesLibres} - Lugares Grandes Ocupados: ${grandesOcupados} - Lugares Pequeños Libres: ${pequeñosLibres} - Lugares Pequeños Ocupados: ${pequeñosOcupados}`
    );

    if (evento instanceof EventoLlegadaAuto) {
      console.log(`rndTamanoActual
  : ${evento.rndTamanoActual
  
      }, tamanoActual: ${evento.tamanoActual}`);
    }
  }

  comenzarEjecucion() {
    const lugaresPequenos = Array.from({ length: 10 }, () => new Lugar('pequeño', 0));
    const lugaresGrandes = Array.from({ length: 6 }, () => new Lugar('grande', 0));
    const lugaresUtilitarios = Array.from({ length: 4 }, () => new Lugar('utilitario', 0));

    const datos = {
      nroAuto: 0,
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
      proximaLlegada: 0,
      rndLlegada: 0,
      rndProximaLlegada:0,
      ProximotiempoEntreLlegadas:0,
      proximaLlegada:0,
      rndTamanoActual:0,
      tamanoActual:0,

    };

    this.inicializarEventos(datos);

    for (let fila = 0; fila < this.CANTIDAD_DE_FILAS_A_SIMULAR; fila++) {
      const eventoProximo = this.extraerEventoProximo(datos);

      eventoProximo.ocurreEvento(datos);

      const utilitariosParcialmenteLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.tamanoActual === 'utilitario' && lugar.ocupados === 1
      ).length;
      const utilitariosLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.tamanoActual === 'utilitario' && lugar.ocupados === 0
      ).length;
      const grandesLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.tamanoActual === 'grande' && lugar.ocupados === 0
      ).length;
      const pequeñosLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.tamanoActual === 'pequeño' && lugar.ocupados === 0
      ).length;

      const autos = datos.autosIngresados.map(auto => {
        return { nro: auto.nro, estado: auto.estado, tamanoActual: auto.tamanoActual };
      });
      const filaCaja = datos.filaCaja.map(auto => {
        return { nro: auto.nro };
      });
      const colaEventos = datos.colaEventos.map(evento => {
        return { nombre: evento.constructor.name, tiempo: evento.tiempoDeOcurrencia };
      });


      if (eventoProximo.tiempoDeOcurrencia > this.CANTIDAD_DE_FILAS_A_SIMULAR * 60) {
        break;
      }

      

      // this.mostrarDatos(eventoProximo, datos);

      const filaDatos = {
        evento: eventoProximo.constructor.name,
        nroAuto: eventoProximo.auto?.nro || ' ', // Obtenemos nroAuto si existe
        //ESTE TIEMPO DE OCURRENCIA ESTA BIEN?
        tiempoActual: eventoProximo.tiempoActual,
        estadoCajero: datos.cajaOcupada ? 'ocupada' : 'libre',
        filaCaja: [...datos.filaCaja],
        utilitariosParcialmenteLibres: utilitariosParcialmenteLibres,
        utilitariosLibres: utilitariosLibres,
        grandesLibres: grandesLibres,
        pequeñosLibres: pequeñosLibres,
        autos: autos,
        eventosCola: datos.colaEventos.map(eventoProximo => ({
          tiempo: eventoProximo.tiempoDeOcurrencia,
          evento: eventoProximo.constructor.name,
        })),
        acumuladorPlata: datos.acumuladorPlata,
        cantAutosIngresados: datos.cantAutosIngresados,
        cantAutosPagaron: datos.cantAutosPagaron,
        proximaLlegada: eventoProximo.proximaLlegada || null,
        rndProximaLlegada: eventoProximo.rndProximaLlegada,
        ProximotiempoEntreLlegadas: eventoProximo.ProximotiempoEntreLlegadas,
        proximaLlegada: eventoProximo.proximaLlegada,
        rndTamanoActual: eventoProximo.rndTamanoActual,
        tamanoActual: eventoProximo.tamanoActual,
      };

      if (eventoProximo instanceof EventoLlegadaAuto) {
        filaDatos.tiempoActual=eventoProximo.tiempoActual;
        filaDatos.rndProximaLlegada = eventoProximo.rndProximaLlegada;
        filaDatos.ProximotiempoEntreLlegadas = eventoProximo.ProximotiempoEntreLlegadas;
        filaDatos.proximaLlegada = eventoProximo.tiempoDeOcurrencia;
        filaDatos.rndTamanoActual = eventoProximo.rndTamanoActual;
        filaDatos.tamanoActual = eventoProximo.tamanoActual;
      }
    

      if (eventoProximo instanceof EventoFinEstacionamiento) {
        filaDatos.rndEstacionamiento = eventoProximo.randomTiempo;
        filaDatos.tEstacionamiento = eventoProximo.tiempoDeEstadia;
        filaDatos.finEstacionamiento = eventoProximo.tiempoDeOcurrencia;
      }

      if (eventoProximo instanceof EventoFinEstacionamiento) {
        filaDatos.tCobro = 2;
        filaDatos.finCobro = eventoProximo.tiempoDeOcurrencia;
      }

       if (eventoProximo instanceof EventoInicializacion) {
        filaDatos.tiempoActual=datos.tiempoActual;
         filaDatos.tiempoEntreLlegadas = eventoProximo.tiempoEntreLlegadas;
         filaDatos.rndLlegada = eventoProximo.rndLlegada;
         filaDatos.proximaLlegada = eventoProximo.proximaLlegada;
       }

      console.log("hasta aca fila", filaDatos);

      if (fila >= this.FILA_A_SIMULAR_DESDE && fila < this.FILA_A_SIMULAR_DESDE + this.CANTIDAD_FILAS_A_MOSTRAR) {
        this.resultados.push({ ...filaDatos, nroFila: fila });
      }
      datos.tiempoActual = eventoProximo.tiempoDeOcurrencia; // Actualiza el tiempo al tiempo de ocurrencia del evento
    }
  }

  extraerEventoProximo(datos) {
    let eventoMasCercano = datos.colaEventos[0];

    datos.colaEventos.forEach(evento => {
      if (evento.tiempoDeOcurrencia < eventoMasCercano.tiempoDeOcurrencia) {
        eventoMasCercano = evento;
      }
    });

    let indice = datos.colaEventos.findIndex(
      evento => evento.tiempoDeOcurrencia === eventoMasCercano.tiempoDeOcurrencia
    );

    if (indice !== -1) {
      datos.colaEventos.splice(indice, 1);
    }

    return eventoMasCercano;
  }

  inicializarEventos(datos) {
    datos.colaEventos.push(new EventoInicializacion(0));
  }

  getResultados() {
    return this.resultados;
  }
}

function tamanoActualDeAuto(random) {
  if (random < 0.6) {
    return 'pequeño'
  } else if (random < 0.85) {
    return 'grande'
  } else {
    return 'utilitario'
  }
}

class EventoInicializacion {
  constructor() {
    this.tiempoDeOcurrencia = 0
    this.rndLlegada = Math.random();
    this.tiempoEntreLlegadas = 12 + this.rndLlegada * (14 - 12);
    this.proximaLlegada = this.tiempoDeOcurrencia + this.tiempoEntreLlegadas;
  }

  ocurreEvento(datos) {
    datos.colaEventos.push(new EventoLlegadaAuto(this.rndLlegada,this.tiempoEntreLlegadas,this.proximaLlegada, datos.nroAuto + 1));
    console.log("EVENTO", this.rndLlegada)
  };

}


class EventoLlegadaAuto {
  constructor(rndLlegada, tiempoEntreLlegadas, tiempoActual) {
    this.rndLlegadaActual = rndLlegada;
    this.tiempoEntreLlegadasActual = tiempoEntreLlegadas;
    this.tiempoActual = tiempoActual;
    this.rndProximaLlegada = Math.random();
    this.ProximotiempoEntreLlegadas = 12 + this.rndProximaLlegada * (14 - 12);
    this.tiempoDeOcurrencia = tiempoActual + this.tiempoEntreLlegadasActual;
  }

  ocurreEvento(datos) {
    this.rndTamanoActual = Math.random();
    this.tamanoActual = tamanoActualDeAuto(this.rndTamanoActual);

    const autoQueLlega = new Auto(this.tamanoActual);

    // Lógica de estacionamiento (sin cambios)
    if (autoQueLlega.tamanoActual === 'grande') {
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.tamanoActual === 'grande' && lugarEstacionamiento.ocupados === 0) {
          lugarEstacionamiento.ocupados += 1;
          autoQueLlega.lugar = lugarEstacionamiento;
          break;
        }
      }
    } else if (autoQueLlega.tamanoActual === 'utilitario') {
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.tamanoActual === 'utilitario' && lugarEstacionamiento.ocupados === 0) {
          lugarEstacionamiento.ocupados += 2;
          autoQueLlega.lugar = lugarEstacionamiento;
          break;
        }
      }
    } else if (autoQueLlega.tamanoActual === 'pequeño') {
      let encontroLugar = false;
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.tamanoActual === 'pequeño' && lugarEstacionamiento.ocupados === 0) {
          lugarEstacionamiento.ocupados += 1;
          autoQueLlega.lugar = lugarEstacionamiento;
          encontroLugar = true;
          break;
        }
      }
      if (!encontroLugar) {
        for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
          const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
          if (lugarEstacionamiento.tamanoActual === 'utilitario' && lugarEstacionamiento.ocupados < 2) {
            lugarEstacionamiento.ocupados += 1;
            autoQueLlega.lugar = lugarEstacionamiento;
            break;
          }
        }
      }
    }

    this.auto = autoQueLlega;

    if (autoQueLlega.lugar) {
      datos.nroAuto += 1;

      autoQueLlega.estado = 'estacionado';
      autoQueLlega.nro = datos.nroAuto;
      datos.cantAutosIngresados += 1;
      datos.autosIngresados.push(autoQueLlega);

      datos.colaEventos.push(new EventoFinEstacionamiento(this.tiempoDeOcurrencia, autoQueLlega));
    }

    datos.colaEventos.push(new EventoLlegadaAuto(this.rndProximaLlegada, this.ProximotiempoEntreLlegadas, this.tiempoDeOcurrencia));
  }
}



function calcularTiempoDeEstadia(random) {
  if (random < 0.5) {
    return 60
  } else if (random < 0.8) {
    return 120
  } else if (random < 0.95) {
    return 180
  } else {
    return 240
  }
}

function calcularCostoEstadia(tiempoDeEstadia, tamanoActualDeAuto) {
  if (tamanoActualDeAuto === 'utilitario') {
    return 1.5 * tiempoDeEstadia
  } else if (tamanoActualDeAuto === 'grande') {
    return 1.2 * tiempoDeEstadia
  } else {
    return 1 * tiempoDeEstadia
  }
}

// evento
// constructor ( new ... )
// this.tiempoDeOcurrencia
// ocurreEvento()

class EventoFinEstacionamiento {
  constructor(tiempoDeLlegada, autoEstacionado) {
    this.randomTiempo = Math.random()

    this.tiempoDeEstadia = calcularTiempoDeEstadia(this.randomTiempo)

    this.tiempoDeOcurrencia = tiempoDeLlegada + this.tiempoDeEstadia

    autoEstacionado.costo = calcularCostoEstadia(this.tiempoDeEstadia, autoEstacionado.tamanoActual)

    this.auto = autoEstacionado
  }

  ocurreEvento(datos) {
    if (this.auto.tamanoActual === 'utilitario') {
      this.auto.lugar.ocupados -= 2
    } else {
      this.auto.lugar.ocupados -= 1
    }

    if (datos.filaCaja.length > 0) {
      this.auto.estado = 'esperando pagar'
      datos.filaCaja.push(this.auto)
    } else {
      if (datos.cajaOcupada) {
        this.auto.estado = 'esperando pagar'
        datos.filaCaja.push(this.auto)
      } else {
        this.auto.estado = 'pagando'
        datos.cajaOcupada = true

        datos.colaEventos.push(new EventoFinCobro(this.tiempoDeOcurrencia, this.auto))
      }
    }
  }
}

class EventoFinCobro {
  constructor(tiempoActual, auto) {
    this.tiempoDeOcurrencia = tiempoActual + 2
    this.auto = auto
  }

  ocurreEvento(datos) {
    datos.cantAutosPagaron += 1
    datos.acumuladorPlata += this.auto.costo

    let indice = datos.autosIngresados.findIndex(auto => auto.nro === this.auto.nro)

    // Si se encuentra el objeto, eliminarlo del arreglo (-1 significa que no encontro nada)
    if (indice !== -1) {
      datos.autosIngresados.splice(indice, 1)
    }

    if (datos.filaCaja.length > 0) {
      const proximoAuto = datos.filaCaja.shift() // saca el primero de la fila

      datos.colaEventos.push(new EventoFinCobro(this.tiempoDeOcurrencia, proximoAuto))
    } else {
      datos.cajaOcupada = false
    }
  }
}

//new TrabajoPractico().comenzarEjecucion()
export default Simulation