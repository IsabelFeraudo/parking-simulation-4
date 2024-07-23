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
      rndProximaLlegada: 0,
      ProximotiempoEntreLlegadas: 0,
      proximaLlegada: 0,
      rndTamanoActual: 0,
      tamanoActual: 0,
      rndTiempoProxFinEstacionamiento: 0,
      tiempoDeEstadiaProxFinEstacionamiento: 0,
      tiempoDeOcurrenciaFinEstacionamiento: 0,
      nroAuto: 0,
      rndFinEstacionamientoActual: 0,
      tiempoDeEstadiaActual: 0,
      tiempoDeOcurrenciaFinEstacionamientoActual: 0,
      rndFinEstacionamientoActual: 0,
      tiempoDeLlegada: 0,
      tiempoDeOcurrenciaFinEstacionamientoActual: 0,
      autosFinEstacionamiento: [],
      rndProximoFinEstacionamiento:0,
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
        return { nro: auto.nro, estado: auto.estado, tamanoActual: auto.tamanoActual, costo:auto.costo };
      });
      const filaCaja = datos.filaCaja.map(auto => {
        return { nro: auto.nro };
      });
      const colaEventos = datos.colaEventos.map(evento => {
        return { nombre: evento.constructor.name, tiempo: evento.tiempoDeOcurrencia };
      });
      // Aquí es donde añadimos el mapeo de autosFinEstacionamiento
      const autosFinEstacionamiento = datos.autosFinEstacionamiento.map(finEstacionamiento => {
        return {
          tiempoDeEstadiaActual: finEstacionamiento.tiempoDeEstadiaActual,
          tiempoDeLlegada: finEstacionamiento.tiempoDeLlegada,
          tiempoDeOcurrenciaFinEstacionamientoActual: finEstacionamiento.tiempoDeOcurrenciaFinEstacionamientoActual,
          auto: {
            nro: finEstacionamiento.auto.nro,
            estado: finEstacionamiento.auto.estado,
            tamanoActual: finEstacionamiento.auto.tamanoActual,
            costo:finEstacionamiento.auto.costo,
          }
        };
      });
      

      if (eventoProximo.tiempoDeOcurrencia > this.CANTIDAD_DE_FILAS_A_SIMULAR * 60) {
        break;
      }

      // this.mostrarDatos(eventoProximo, datos);

      const filaDatos = {
        evento: eventoProximo.constructor.name,
        nroAuto: eventoProximo.auto?.nro || ' ', // Obtenemos nroAuto si existe
        tiempoActual: eventoProximo.tiempoActual,
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
        rndTamanoActual: eventoProximo.rndTamanoActual,
        tamanoActual: eventoProximo.tamanoActual,
        //rndTiempoProxFinEstacionamiento: eventoProximo.rndTiempoProxFinEstacionamiento,
        //tiempoDeEstadiaProxFinEstacionamiento: eventoProximo.tiempoDeEstadiaProxFinEstacionamiento,
        //tiempoDeOcurrenciaFinEstacionamiento: eventoProximo.tiempoDeOcurrenciaFinEstacionamiento,
        //rndFinEstacionamientoActual: eventoProximo.rndFinEstacionamientoActual,
        //tiempoDeEstadiaActual: eventoProximo.tiempoDeEstadiaActual,
        //tiempoDeOcurrenciaFinEstacionamientoActual: eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual,
        tiempoDeLlegada: eventoProximo.tiempoDeLlegada,
        nroFila: fila,
        //rndProximoFinEstacionamiento:eventoProximo.rndProximoFinEstacionamiento,
      };


      if (eventoProximo instanceof EventoFinEstacionamiento) {
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.nroAuto = eventoProximo.auto.nro; // Obtener el número de auto
      
        // Evento cobro
        filaDatos.tCobro = 2; // Asumiendo que tCobro es una constante
        filaDatos.finCobro = eventoProximo.finCobro; // Obtener el tiempo de cobro
        console.log("TIEMPO:", filaDatos.tiempoDeOcurrenciaFinEstacionamiento);
        console.log("NRO AUTO:", filaDatos.nroAuto);
        console.log("FIN COBRO:", filaDatos.finCobro);
      }
      
      

      if (eventoProximo instanceof EventoLlegadaAuto) {
        filaDatos.nroAuto = eventoProximo.auto.nro; // Accede al número de auto correctamente
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaLlegadaActual;
        filaDatos.rndProximaLlegada = eventoProximo.rndProximaLlegada;
        filaDatos.ProximotiempoEntreLlegadas = eventoProximo.ProximotiempoEntreLlegadas;
        filaDatos.proximaLlegada = eventoProximo.tiempoProximaOcurrencia;
        filaDatos.rndTamanoActual = eventoProximo.rndTamanoActual;
        filaDatos.tamanoActual = eventoProximo.tamanoActual;
      
        // Crea EventoFinEstacionamiento
        filaDatos.rndProximoFinEstacionamiento = eventoProximo.rndProximoFinEstacionamiento;
        filaDatos.tiempoDeEstadiaProxFinEstacionamiento = eventoProximo.tiempoDeEstadia;
        filaDatos.tiempoDeLlegada = eventoProximo.tiempoActual; // Ajuste necesario
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamiento;
      }
      
    
      if (eventoProximo instanceof EventoFinEstacionamiento) {
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.nroAuto = eventoProximo.auto.nro; // Obtener el número de auto
      
        console.log("TIEMPO:", filaDatos.tiempoDeOcurrenciaFinEstacionamiento);
        console.log("NRO AUTO:", filaDatos.nroAuto);
      }
      


       if (eventoProximo instanceof EventoInicializacion) {
        filaDatos.tiempoActual=datos.tiempoActual;
         filaDatos.ProximotiempoEntreLlegadas = eventoProximo.tiempoEntreLlegadas;
         filaDatos.rndProximaLlegada = eventoProximo.rndLlegada;
         filaDatos.proximaLlegada = eventoProximo.proximaLlegada;
       }

       if (eventoProximo instanceof EventoFinCobro) {
        filaDatos.tiempoActual=eventoProximo.tiempoDeOcurrenciaFinCobro;
        filaDatos.tCobro = 2;
        filaDatos.finCobro=eventoProximo.tiempoProximaOcurrenciaFinCobro;
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

function insertarEvento(eventosCola, nuevoEvento) {
  // Insertar el nuevo evento en la cola
  eventosCola.push(nuevoEvento);
  
  // Ordenar la cola de eventos por tiempo de ocurrencia
  eventosCola.sort((a, b) => a.tiempoDeOcurrencia - b.tiempoDeOcurrencia);
}

class EventoInicializacion {
constructor(tiempoActual) {
  this.tiempoDeOcurrencia = tiempoActual;
  this.rndLlegada = Math.random();
  this.tiempoEntreLlegadas = 12 + this.rndLlegada * (14 - 12);
  this.proximaLlegada = tiempoActual + this.tiempoEntreLlegadas;
  //this.tiempoActual = tiempoActual;
}

ocurreEvento(datos) {
  insertarEvento(datos.colaEventos, new EventoLlegadaAuto(this.rndLlegada, this.tiempoEntreLlegadas, this.proximaLlegada));
  //this.tiempoActual=this.proximaLlegada;
  console.log("tiempo actual", this.tiempoActual)
}
}


class EventoLlegadaAuto {
  constructor(rndLlegada, tiempoEntreLlegadas, proximaLlegada) {
    // Valores de llegada actual
    this.rndLlegadaActual = rndLlegada;
    this.tiempoEntreLlegadasActual = tiempoEntreLlegadas;
    this.tiempoDeOcurrencia=proximaLlegada;
    this.tiempoDeOcurrenciaLlegadaActual=this.tiempoDeOcurrencia;
    //this.tiempoActual = tiempoActual;

    // Evento Próxima llegada
    this.rndProximaLlegada = Math.random();
    this.ProximotiempoEntreLlegadas = 12 + this.rndProximaLlegada * (14 - 12);
    this.tiempoProximaOcurrencia = this.tiempoDeOcurrencia + this.tiempoEntreLlegadasActual;

    // Evento FinEstacionamiento
    this.rndProximoFinEstacionamiento = Math.random();
    this.tiempoDeEstadia = calcularTiempoDeEstadia(this.rndProximoFinEstacionamiento);
    this.tiempoDeOcurrenciaFinEstacionamiento = this.tiempoDeOcurrencia + this.tiempoDeEstadia;
  }

  ocurreEvento(datos) {
    this.rndTamanoActual = Math.random();
    this.tamanoActual = tamanoActualDeAuto(this.rndTamanoActual);
    this.costo = calcularCostoEstadia(this.tiempoDeEstadia,this.tamanoActual);


    const autoQueLlega = new Auto(this.tamanoActual, this.costo);

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
      autoQueLlega.costo=this.costo;
      datos.cantAutosIngresados += 1;
      datos.autosIngresados.push(autoQueLlega);
      // Agregar el auto a autosFinEstacionamiento

  datos.autosFinEstacionamiento.push({
    tiempoDeEstadiaActual: this.tiempoDeEstadia,
    tiempoDeLlegada: this.tiempoActual,
    tiempoDeOcurrenciaFinEstacionamientoActual: this.tiempoDeOcurrenciaFinEstacionamiento,
    auto: {
      nro: this.auto.nro,
      estado: this.auto.estado,
      tamanoActual: this.auto.tamanoActual
    }
  });
  console.log("TIEMPO ESTACIONAMIENTO",this.tiempoDeOcurrenciaFinEstacionamiento)

      datos.colaEventos.push(new EventoFinEstacionamiento(this.rndProximoFinEstacionamiento, this.tiempoDeEstadiaActual, this.tiempoDeOcurrencia, this.tiempoDeOcurrenciaFinEstacionamiento, autoQueLlega));
    }

    datos.colaEventos.push(new EventoLlegadaAuto(this.rndProximaLlegada, this.ProximotiempoEntreLlegadas, this.tiempoProximaOcurrencia));
  
  
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
  constructor(rndFinEstacionamientoActual, tiempoDeEstadiaActual, tiempoDeLlegada, tiempoDeOcurrenciaFinEstacionamientoActual, autoQueLlega) {
    // Valores fin de estacionamiento actual
    this.rndFinEstacionamientoActual = rndFinEstacionamientoActual;
    this.tiempoDeEstadiaActual = tiempoDeEstadiaActual;
    this.tiempoDeLlegada = tiempoDeLlegada;
    this.tiempoDeOcurrenciaFinEstacionamientoActual = tiempoDeOcurrenciaFinEstacionamientoActual;
    this.auto = autoQueLlega;
    this.tiempoDeOcurrencia= this.tiempoDeOcurrenciaFinEstacionamientoActual;
    
    // Calcular el tiempo de cobro
    this.finCobro = this.tiempoDeOcurrencia + 2; // Por ejemplo, 2 unidades de tiempo después del fin de estacionamiento
  }

  ocurreEvento(datos) {
    // Actualizar la ocupación del lugar
    if (this.auto.tamanoActual === 'utilitario') {
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
        datos.colaEventos.push(new EventoFinCobro(this.finCobro, this.auto));
      }
    }

    // Eliminar el auto de autosFinEstacionamiento
    datos.autosFinEstacionamiento = datos.autosFinEstacionamiento.filter(autoFin => autoFin.auto.nro !== this.auto.nro);
  }
}



class EventoFinCobro {
  constructor(tiempoActual, auto) {
    this.tiempoDeOcurrencia=tiempoActual;
    this.tiempoDeOcurrenciaFinCobro=this.tiempoDeOcurrencia;
    this.tiempoProximaOcurrenciaFinCobro = tiempoActual + 2
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

      datos.colaEventos.push(new EventoFinCobro(this.tiempoProximaOcurrencia, proximoAuto))
    } else {
      datos.cajaOcupada = false
    }
  }
}

//new TrabajoPractico().comenzarEjecucion()
export default Simulation