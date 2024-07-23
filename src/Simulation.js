// Tiempo expresado en minutos
const CANTIDAD_DE_FILAS_A_SIMULAR = 100
const CANTIDAD_HORAS_A_SIMULAR = 10000

class Auto {
  constructor(tamano, id, estado, lugar, costo) {
    this.id = id
    this.tamano = tamano // pequeño
    this.estado = estado // estacionado, esperando pagar, pagando
    this.lugar = lugar // { tipo: grande }
    this.costo = costo
  }
}

class Lugar {
  constructor(parking_size, ocupados) {
    this.parking_size = parking_size // grande, pequeño, utilitario
    this.ocupados = ocupados // 0, 1, 2
  }
}

class Simulation {
  constructor(cantidadFilasASimular) {
    this.CANTIDAD_DE_FILAS_A_SIMULAR = cantidadFilasASimular;
    this.resultados = [];
  }

  mostrarDatos(evento, datos) {
    const utilitariosParcialmenteLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.parking_size === 'utilitario' && lugar.ocupados === 1
    ).length;
    const utilitariosLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.parking_size === 'utilitario' && lugar.ocupados === 0
    ).length;
    const utilitariosOcupados = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.parking_size === 'utilitario' && lugar.ocupados === 2
    ).length;
    const grandesLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.parking_size === 'grande' && lugar.ocupados === 0
    ).length;
    const grandesOcupados = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.parking_size === 'grande' && lugar.ocupados === 1
    ).length;
    const pequeñosLibres = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.parking_size === 'pequeño' && lugar.ocupados === 0
    ).length;
    const pequeñosOcupados = datos.lugaresDeEstacionamiento.filter(
      lugar => lugar.parking_size === 'pequeño' && lugar.ocupados === 1
    ).length;
    const autos = datos.autosIngresados.map(auto => {
      return { id: auto.id, estado: auto.estado };
    });
    const filaCaja = datos.filaCaja.map(auto => {
      return { id: auto.id };
    });
    const colaEventos = datos.colaEventos.map(evento => {
      return { nombre: evento.constructor.name, tiempo: evento.tiempoDeSiguienteOcurrencia };
    });

    console.log(
      `${evento.constructor.name} - t: ${evento.tiempoActual} \nProximos Eventos: ${JSON.stringify(
        colaEventos
      )} \nAutos Ingresados: ${JSON.stringify(autos)} \nCaja Ocupada: ${datos.cajaOcupada
      } - Fila en Caja: ${JSON.stringify(
        filaCaja
      )}\nLugares Utilitarios Parcialmente Libres: ${utilitariosParcialmenteLibres} - Lugares Utilitarios Libres: ${utilitariosLibres} - Lugares Utilitarios Ocupados: ${utilitariosOcupados} - Lugares Grandes Libres: ${grandesLibres} - Lugares Grandes Ocupados: ${grandesOcupados} - Lugares Pequeños Libres: ${pequeñosLibres} - Lugares Pequeños Ocupados: ${pequeñosOcupados}`
    );

    if (evento instanceof EventoLlegadaAuto) {
      console.log(`rndtamano: ${evento.rndtamano}, tamano: ${evento.tamano}`);
    }
  }

  comenzarEjecucion() {
    const lugaresPequenos = Array.from({ length: 10 }, () => new Lugar('pequeño', 0));
    const lugaresGrandes = Array.from({ length: 6 }, () => new Lugar('grande', 0));
    const lugaresUtilitarios = Array.from({ length: 4 }, () => new Lugar('utilitario', 0));

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
        lugar => lugar.parking_size === 'utilitario' && lugar.ocupados === 1
      ).length;
      const utilitariosLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.parking_size === 'utilitario' && lugar.ocupados === 0
      ).length;
      const grandesLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.parking_size === 'grande' && lugar.ocupados === 0
      ).length;
      const pequeñosLibres = datos.lugaresDeEstacionamiento.filter(
        lugar => lugar.parking_size === 'pequeño' && lugar.ocupados === 0
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
      // this.mostrarDatos(eventoProximo, datos);

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
        console.log("TIEMPO:", filaDatos.tiempoDeOcurrenciaFinEstacionamiento);
        console.log("id AUTO:", filaDatos.idAuto);
        console.log("FIN COBRO:", filaDatos.finCobro);
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
        console.log("TIEMPO:", filaDatos.tiempoDeOcurrenciaFinEstacionamiento);
        console.log("id AUTO:", filaDatos.idAuto);
      }

      if (eventoProximo instanceof EventoInicializacion) {
        filaDatos.tiempoActual = datos.tiempoActual;
        filaDatos.ProximotiempoEntreLlegadas = eventoProximo.tiempoEntreLlegadas;
        filaDatos.rndProximaLlegada = eventoProximo.rndLlegada;
        filaDatos.proximaLlegada = eventoProximo.proximaLlegada;
      }

      console.log("hasta aca fila", filaDatos);

      if (fila >= this.FILA_A_SIMULAR_DESDE && fila < this.FILA_A_SIMULAR_DESDE + this.CANTIDAD_FILAS_A_MOSTRAR) {
        this.resultados.push({ ...filaDatos, idFila: fila });
      }
      datos.tiempoActual = eventoProximo.tiempoDeSiguienteOcurrencia; // Actualiza el tiempo al tiempo de ocurrencia del evento
    }
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

  inicializarEventos(datos) {
    datos.colaEventos.push(new EventoInicializacion(0));
  }

  getResultados() {
    return this.resultados;
  }
}

function tamanoDeAuto(random) {
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
  eventosCola.sort((a, b) => a.tiempoDeSiguienteOcurrencia - b.tiempoDeSiguienteOcurrencia);
}

class EventoInicializacion {
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
    console.log("tiempo actual", this.tiempoActual)
  }
}

class EventoLlegadaAuto {
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
    if (autoQueLlega.tamano === 'grande') {
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.parking_size === 'grande' && lugarEstacionamiento.ocupados === 0) {
          lugarEstacionamiento.ocupados += 1;
          autoQueLlega.lugar = lugarEstacionamiento;
          break;
        }
      }
    } else if (autoQueLlega.tamano === 'utilitario') {
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.parking_size === 'utilitario' && lugarEstacionamiento.ocupados === 0) {
          lugarEstacionamiento.ocupados += 2;
          autoQueLlega.lugar = lugarEstacionamiento;
          break;
        }
      }
    } else if (autoQueLlega.tamano === 'pequeño') {
      let encontroLugar = false;
      for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
        const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
        if (lugarEstacionamiento.parking_size === 'pequeño' && lugarEstacionamiento.ocupados === 0) {
          lugarEstacionamiento.ocupados += 1;
          autoQueLlega.lugar = lugarEstacionamiento;
          encontroLugar = true;
          break;
        }
      }
      if (!encontroLugar) {
        for (let i = 0; i < datos.lugaresDeEstacionamiento.length; i++) {
          const lugarEstacionamiento = datos.lugaresDeEstacionamiento[i];
          if (lugarEstacionamiento.parking_size === 'utilitario' && lugarEstacionamiento.ocupados < 2) {
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
      console.log("TIEMPO ESTACIONAMIENTO", this.tiempoDeOcurrenciaFinEstacionamiento)
      datos.colaEventos.push(new EventoFinEstacionamiento(this.rndProximoFinEstacionamiento, this.tiempoDeEstadiaActual, this.tiempoActual, this.tiempoDeOcurrenciaFinEstacionamiento, autoQueLlega));
    }
    datos.colaEventos.push(new EventoLlegadaAuto(this.rndProximaLlegada, this.ProximotiempoEntreLlegadas, this.tiempoDeSiguienteOcurrencia));
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

function calcularCostoEstadia(tiempoDeEstadia, tamanoDeAuto) {
  if (tamanoDeAuto === 'utilitario') {
    return 1.5 * tiempoDeEstadia
  } else if (tamanoDeAuto === 'grande') {
    return 1.2 * tiempoDeEstadia
  } else {
    return 1 * tiempoDeEstadia
  }
}

// evento
// constructor ( new ... )
// this.tiempoDeSiguienteOcurrencia
// ocurreEvento()

class EventoFinEstacionamiento {
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
    if (this.auto.tamano === 'utilitario') {
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
class EventoFinCobro {
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

//new TrabajoPractico().comenzarEjecucion()
export default Simulation