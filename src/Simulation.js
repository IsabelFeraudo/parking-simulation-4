
const valoresUsuario = {
  cantidadFilasASimular: 0,
  filaASimularDesde: 0,
  cantidadFilasAMostrar: 0,
  cantidadHorasASimular: 0,
  mostrarDesdeHora: 0,
  mostrarHastaHora: 0,
  modoSimulacion: 'filas' // Puede ser 'horas'
};

class Auto {
  constructor(tamanoActual, nro, estado, lugar, costo,tiempoFinEstacionamiento) {
    this.nro = nro
    this.tamanoActual = tamanoActual // pequeño
    this.estado = estado // estacionado, esperando pagar, pagando
    this.lugar = lugar // { tipo: grande }
    this.costo = costo
    this.tiempoFinEstacionamiento=tiempoFinEstacionamiento
  }
}

class Lugar {
  constructor(tamanoActual, ocupados) {
    this.tamanoActual = tamanoActual // grande, pequeño, utilitario
    this.ocupados = ocupados // 0, 1, 2
  }
}

class Simulation {
  constructor(modoSimulacion,cantidadFilasASimular, filaASimularDesde, cantidadFilasAMostrar,cantidadHorasASimular, mostrarDesdeHora,mostrarHastaHora ) {
    this.MODO_SIMULACION= modoSimulacion;
    this.CANTIDAD_DE_FILAS_A_SIMULAR = cantidadFilasASimular;
    this.FILA_A_SIMULAR_DESDE = filaASimularDesde;
    this.CANTIDAD_FILAS_A_MOSTRAR = cantidadFilasAMostrar;
    this.CANTIDAD_DE_HORAS_A_SIMULAR= cantidadHorasASimular;
    this.MOSTRAR_DESDE_HORA=mostrarDesdeHora;
    this.MOSTRAR_HASTA_HORA=mostrarHastaHora;
    this.resultados = [];
    this.totalAutosPagaron=0;
    this.totalRecaudacion=0;
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
      return { nro: auto.nro, estado: auto.estado, tiempoFinEstacionamiento:auto.tiempoFinEstacionamiento };
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
      rndFinEstacionamientoActual: 0,
      tiempoDeEstadiaActual: 0,
      tiempoDeOcurrenciaFinEstacionamientoActual: 0,
      rndFinEstacionamientoActual: 0,
      tiempoDeLlegada: 0,
      tiempoDeOcurrenciaFinEstacionamientoActual: 0,
      autosFinEstacionamiento: [],
      rndProximoFinEstacionamiento:0,
      tarifaAuto:0,
      totalAutosPagaron:0,
      totalRecaudacion:0,
      proximoFinCobro:0,
    };

    this.inicializarEventos(datos);
    console.log("DATOS;",this.CANTIDAD_DE_HORAS_A_SIMULAR,this.MOSTRAR_DESDE_HORA,this.MOSTRAR_HASTA_HORA)


    //SIMULACION POR HORAS
    if (this.MODO_SIMULACION === 'horas') {
      console.log("MODO SIM:", this.MODO_SIMULACION)
    const tiempoSimulacionMax = this.CANTIDAD_DE_HORAS_A_SIMULAR * 60; // Convertir horas a minutos

    // Inicializar el tiempo actual al inicio de la simulación
    datos.tiempoActual = 0;
    console.log("tiempoSimulacionMax", tiempoSimulacionMax)
    while (datos.tiempoActual < tiempoSimulacionMax) {
     
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
        return { nro: auto.nro, estado: auto.estado, tamanoActual: auto.tamanoActual, costo:auto.costo,tiempoFinEstacionamiento:auto.tiempoFinEstacionamiento };
      });
      const filaCaja = datos.filaCaja.map(auto => {
        return { nro: auto.nro };
      });
      const colaEventos = datos.colaEventos.map(evento => {
        return { nombre: evento.constructor.name, tiempo: evento.tiempoDeOcurrencia };
      });
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

      if (eventoProximo.tiempoDeOcurrencia > tiempoSimulacionMax) {
        break;
      }

      const filaDatos = {
        evento: eventoProximo.constructor.name,
        nroAuto: eventoProximo.auto?.nro || ' ',
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
        cantAutosIngresados: datos.cantAutosIngresados,
        totalAutosPagaron: datos.totalAutosPagaron,
        proximaLlegada: eventoProximo.proximaLlegada || null,
        rndProximaLlegada: eventoProximo.rndProximaLlegada,
        ProximotiempoEntreLlegadas: eventoProximo.ProximotiempoEntreLlegadas,
        proximaLlegada: eventoProximo.proximaLlegada,
        rndTamanoActual: eventoProximo.rndTamanoActual,
        tamanoActual: eventoProximo.tamanoActual,
        tiempoDeLlegada: eventoProximo.tiempoDeLlegada,
        tarifaAuto: 0,
        totalRecaudacion: datos.totalRecaudacion,
        proximoFinCobro:eventoProximo.proximoFinCobro,
      };

      if (eventoProximo instanceof EventoFinEstacionamiento) {
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
        filaDatos.nroAuto = eventoProximo.auto.nro;
        filaDatos.tCobro = 2;
        filaDatos.finCobro = eventoProximo.finCobro;
        filaDatos.tarifaAuto = eventoProximo.auto.costo;
        filaDatos.proximaLlegada=eventoProximo.proximaLlegada;
        
      }

      if (eventoProximo instanceof EventoLlegadaAuto) {
        filaDatos.nroAuto = eventoProximo.auto.nro;
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaLlegadaActual;
        filaDatos.rndProximaLlegada = eventoProximo.rndProximaLlegada;
        filaDatos.ProximotiempoEntreLlegadas = eventoProximo.ProximotiempoEntreLlegadas;
        filaDatos.proximaLlegada = eventoProximo.tiempoProximaOcurrencia;
        filaDatos.rndTamanoActual = eventoProximo.rndTamanoActual;
        filaDatos.tamanoActual = eventoProximo.tamanoActual;
        filaDatos.tarifaAuto = eventoProximo.auto.costo;
        filaDatos.rndProximoFinEstacionamiento = eventoProximo.rndProximoFinEstacionamiento;
        filaDatos.tiempoDeEstadiaProxFinEstacionamiento = eventoProximo.tiempoDeEstadia;
        filaDatos.tiempoDeLlegada = eventoProximo.tiempoActual;
        filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamiento;
        filaDatos.finCobro = eventoProximo.finCobro;
      }

      if (eventoProximo instanceof EventoInicializacion) {
        filaDatos.tiempoActual = datos.tiempoActual;
        filaDatos.ProximotiempoEntreLlegadas = eventoProximo.tiempoEntreLlegadas;
        filaDatos.rndProximaLlegada = eventoProximo.rndLlegada;
        filaDatos.proximaLlegada = eventoProximo.proximaLlegada;
      }

      if (eventoProximo instanceof EventoFinCobro) {
        filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinCobro;
        filaDatos.tCobro = 2;
        filaDatos.finCobro = eventoProximo.tiempoProximaOcurrenciaFinCobro;
        filaDatos.tarifaAuto = eventoProximo.auto.costo;
        filaDatos.proximaLlegada=datos.proximaLlegada;
      }

      if (datos.tiempoActual >= this.MOSTRAR_DESDE_HORA * 60 && datos.tiempoActual < this.MOSTRAR_HASTA_HORA * 60 && eventoProximo.tiempoDeOcurrencia < this.MOSTRAR_HASTA_HORA * 60) {
        this.resultados.push({ ...filaDatos, nroFila: this.resultados.length });
        this.totalAutosPagaron = datos.totalAutosPagaron;
        this.totalRecaudacion = datos.totalRecaudacion;
      }

      datos.tiempoActual = eventoProximo.tiempoDeOcurrencia;
    }
  }else {
       //SIMULACION POR FILAS
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
          return { nro: auto.nro, estado: auto.estado, tamanoActual: auto.tamanoActual, costo:auto.costo,tiempoFinEstacionamiento:auto.tiempoFinEstacionamiento };
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
          cantAutosIngresados: datos.cantAutosIngresados,
          totalAutosPagaron: datos.totalAutosPagaron,
          proximaLlegada: eventoProximo.proximaLlegada || null,
          rndProximaLlegada: eventoProximo.rndProximaLlegada,
          ProximotiempoEntreLlegadas: eventoProximo.ProximotiempoEntreLlegadas,
          proximaLlegada: eventoProximo.proximaLlegada,
          rndTamanoActual: eventoProximo.rndTamanoActual,
          tamanoActual: eventoProximo.tamanoActual,
          tiempoDeLlegada: eventoProximo.tiempoDeLlegada,
          nroFila: fila,
          tarifaAuto:0,
          totalRecaudacion:datos.totalRecaudacion,
          tiempoProximaOcurrenciaFinCobro:eventoProximo.tiempoProximaOcurrenciaFinCobro,

        };
  
  
        if (eventoProximo instanceof EventoFinEstacionamiento) {
          filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
          filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
          filaDatos.nroAuto = eventoProximo.auto.nro; // Obtener el número de auto
        
          // Evento cobro
          filaDatos.tCobro = 2; // Asumiendo que tCobro es una constante
          filaDatos.finCobro = eventoProximo.finCobro; // Obtener el tiempo de cobro
          filaDatos.tarifaAuto=eventoProximo.auto.costo;

          filaDatos.proximaLlegada=eventoProximo.proximaLlegada;
        }
        
        
        
  
        if (eventoProximo instanceof EventoLlegadaAuto) {
          filaDatos.nroAuto = eventoProximo.auto.nro; // Accede al número de auto correctamente
          filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaLlegadaActual;
          filaDatos.rndProximaLlegada = eventoProximo.rndProximaLlegada;
          filaDatos.ProximotiempoEntreLlegadas = eventoProximo.ProximotiempoEntreLlegadas;
          filaDatos.proximaLlegada = eventoProximo.tiempoProximaOcurrencia;
          filaDatos.rndTamanoActual = eventoProximo.rndTamanoActual;
          filaDatos.tamanoActual = eventoProximo.tamanoActual;
          filaDatos.tarifaAuto=eventoProximo.auto.costo;
          filaDatos.finCobro = eventoProximo.finCobro;
  
          // Crea EventoFinEstacionamiento
          filaDatos.rndProximoFinEstacionamiento = eventoProximo.rndProximoFinEstacionamiento;
          filaDatos.tiempoDeEstadiaProxFinEstacionamiento = eventoProximo.tiempoDeEstadia;
          filaDatos.tiempoDeLlegada = eventoProximo.tiempoActual; // Ajuste necesario
          filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamiento;
       
          filaDatos.proximaLlegada = datos.proximaLlegada;

        }
        
      
        if (eventoProximo instanceof EventoFinEstacionamiento) {
          filaDatos.tiempoActual = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
          filaDatos.tiempoDeOcurrenciaFinEstacionamiento = eventoProximo.tiempoDeOcurrenciaFinEstacionamientoActual;
          filaDatos.nroAuto = eventoProximo.auto.nro; // Obtener el número de auto
          filaDatos.proximaLlegada = eventoProximo.proximaLlegada;
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
          filaDatos.tarifaAuto=eventoProximo.auto.costo;
          filaDatos.proximaLlegada = eventoProximo.proximaLlegada;
         }
  
        console.log("hasta aca fila", filaDatos);
  
        if (fila >= this.FILA_A_SIMULAR_DESDE && fila < this.FILA_A_SIMULAR_DESDE + this.CANTIDAD_FILAS_A_MOSTRAR) {
          this.resultados.push({ ...filaDatos, nroFila: fila });
          this.totalAutosPagaron=datos.totalAutosPagaron;
          this.totalRecaudacion=datos.totalRecaudacion;
        }
        datos.tiempoActual = eventoProximo.tiempoDeOcurrencia; // Actualiza el tiempo al tiempo de ocurrencia del evento
      }
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
  getTotalAutosPagaron() {
    return this.totalAutosPagaron;
  }
  getTotalRecaudacion() {
    return this.totalRecaudacion;
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
    this.finCobro= obtenerTiempoDeOcurrenciaFinCobro(datos);
    datos.proximoFinCobro=obtenerTiempoDeOcurrenciaFinCobro(datos);
    datos.proximaLlegada=this.tiempoProximaOcurrencia;
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
      tamanoActual: this.auto.tamanoActual,
      tiempoFinEstacionamiento:this.tiempoDeOcurrenciaFinEstacionamiento,
    }
  });
  console.log("TIEMPO ESTACIONAMIENTO",this.tiempoDeOcurrenciaFinEstacionamiento)
  autoQueLlega.tiempoFinEstacionamiento=this.tiempoDeOcurrenciaFinEstacionamiento;
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
class EventoFinEstacionamiento {
  constructor(rndFinEstacionamientoActual, tiempoDeEstadiaActual, tiempoDeLlegada, tiempoDeOcurrenciaFinEstacionamientoActual, autoQueLlega) {
    // Valores fin de estacionamiento actual
    this.rndFinEstacionamientoActual = rndFinEstacionamientoActual;
    this.tiempoDeEstadiaActual = tiempoDeEstadiaActual;
    this.tiempoDeLlegada = tiempoDeLlegada;
    this.tiempoDeOcurrenciaFinEstacionamientoActual = tiempoDeOcurrenciaFinEstacionamientoActual;
    this.auto = autoQueLlega;
    this.tiempoDeOcurrencia = this.tiempoDeOcurrenciaFinEstacionamientoActual;
   
  }

  ocurreEvento(datos) {
    this.auto.tiempoFinEstacionamiento=this.tiempoDeOcurrenciaFinEstacionamiento;

    datos.proximaLlegada=obtenerMayorTiempoDeOcurrencia(datos);
    this.proximaLlegada=obtenerMayorTiempoDeOcurrencia(datos);
    this.finCobro=obtenerTiempoDeOcurrenciaFinCobro(datos);
    // Actualizar la ocupación del lugar
    if (this.auto.tamanoActual === 'utilitario') {
      this.auto.lugar.ocupados -= 2;
    } else {
      this.auto.lugar.ocupados -= 1;
    }

    // Eliminar el auto de autosFinEstacionamiento
    datos.autosFinEstacionamiento = datos.autosFinEstacionamiento.filter(autoFin => autoFin.auto.nro !== this.auto.nro);

    // Procesar el pago en la caja
    if (datos.filaCaja.length > 0) {
      // La caja tiene autos en espera, el auto actual pasa a estado "esperando pagar"
      this.auto.estado = 'esperando pagar';
      datos.filaCaja.push(this.auto);
    } else {
      // La caja está libre, el auto actual pasa a estado "pagando"
      if (!datos.autosIngresados.some(auto => auto.estado === 'pagando')) {
        this.auto.estado = 'pagando';
        datos.cajaOcupada = "ocupada";

        // Solo se genera un nuevo EventoFinCobro si no existe ya un evento de este tipo en la cola de eventos
         // Calcular el tiempo de cobro
        const existeEventoFinCobro = datos.colaEventos.some(evento => evento instanceof EventoFinCobro);

        if (!existeEventoFinCobro) {
          this.finCobro = this.tiempoDeOcurrencia + 2; // Por ejemplo, 100 unidades de tiempo después del fin de estacionamiento

          datos.colaEventos.push(new EventoFinCobro(this.finCobro, this.auto));
        }
      } else {
        // Si ya hay un auto en estado "pagando", el auto actual pasa a estado "esperando pagar"
        this.auto.estado = 'esperando pagar';
        datos.filaCaja.push(this.auto);
      }
    }
  }
}


class EventoFinCobro {
  constructor(tiempoActual, auto) {
    this.tiempoDeOcurrencia = tiempoActual;
    this.tiempoDeOcurrenciaFinCobro = this.tiempoDeOcurrencia;
    this.tiempoProximaOcurrenciaFinCobro=tiempoActual;
    
    this.auto = auto;
  }

  ocurreEvento(datos) {
    // Actualizar el estado del sistema
    datos.totalAutosPagaron++;
    this.totalAutosPagaron=datos.totalAutosPagaron;
    datos.totalRecaudacion += this.auto.costo;
    datos.finCobro=this.tiempoDeOcurrencia;
    datos.proximaLlegada=obtenerMayorTiempoDeOcurrencia(datos);
    this.proximaLlegada=obtenerMayorTiempoDeOcurrencia(datos);
    // 1. Eliminar el auto que está en estado "pagando" del arreglo autos
    let indicePagando = datos.autosIngresados.findIndex(auto => auto.estado === "pagando");
    if (indicePagando !== -1) {
      datos.autosIngresados.splice(indicePagando, 1);
    }

    // 2. Buscar el auto que haya llegado a la caja primero (menor tiempo de fin de estacionamiento)
    let autosEsperando = datos.autosIngresados.filter(auto => auto.estado === "esperando pagar");
    let autoPrioritario = null;
console.log("autose esperando",autosEsperando )
    
// if (autosEsperando.length > 0) {
//       autoPrioritario = autosEsperando.reduce((prev, curr) => (prev.tiempoFinEstacionamiento < curr.tiempoFinEstacionamiento ? prev : curr));
//     }
//     console.log("autose prio",autoPrioritario )
    
if (autosEsperando.length > 0) {
  const menorTiempoFin = Math.min(...autosEsperando.map(auto => auto.tiempoFinEstacionamiento));
  autoPrioritario = autosEsperando.find(auto => auto.tiempoFinEstacionamiento === menorTiempoFin);
  console.log("autosEsperando",autosEsperando)
}console.log("autose prio",autoPrioritario )
    if (autoPrioritario) {
      // Cambiar el estado del auto a "pagando"
      autoPrioritario.estado = "pagando";
      console.log("ACCAAAAA")
      
          // Si había un auto esperando en la cola de la caja, se debe quitar de la fila de caja
    let indicePrioritario = datos.filaCaja.findIndex(auto => auto.nro === this.auto.nro);
    if (indicePrioritario !== -1) {
      datos.filaCaja.splice(indicePrioritario, 1);
    }

      
      //this.totalRecaudacion=autoPrioritario.costo;
      //this.tiempoProximaOcurrenciaFinCobro=this.tiempoDeOcurrencia;
      // Crear un nuevo evento si hay más autos en la cola de la caja
      if (datos.filaCaja.length > 0) {
        // Verificar si ya existe un evento fin de cobro en la cola de eventos
        
        const existeEventoFinCobro = datos.colaEventos.some(evento => evento instanceof EventoFinCobro);
        
        if (!existeEventoFinCobro) {
          // Solo se crea un nuevo EventoFinCobro si no hay uno ya en la cola de eventos
          this.tiempoProximaOcurrenciaFinCobro = this.tiempoDeOcurrencia+2;
          datos.finCobro=this.tiempoProximaOcurrenciaFinCobro;
          const proximoAuto = datos.filaCaja[0]; // Obtener el primer auto de la fila sin removerlo
         // datos.colaEventos.push(new EventoFinCobro(this.tiempoProximaOcurrenciaFinCobro, proximoAuto));
        }
      } else {
        
        datos.cajaOcupada = false; // Si no hay más autos en la cola, la caja pasa a estar libre
      }
    } else {
      datos.cajaOcupada = false; // Si no hay autos esperando, la caja pasa a estar libre
    }

    console.log(`Total Autos Pagaron: ${datos.totalAutosPagaron}`);
console.log(`Total Recaudacion: ${datos.totalRecaudacion}`);
  }
}

function obtenerMayorTiempoDeOcurrencia(datos) {
  // Filtrar los eventos para obtener solo los EventoLlegadaAuto
  const eventosLlegada = datos.colaEventos.filter(evento => evento instanceof EventoLlegadaAuto);

  // Si no hay eventos de llegada, retornar undefined o un valor apropiado
  if (eventosLlegada.length === 0) {
    return undefined; // O cualquier valor que consideres apropiado
  }

  // Encontrar el EventoLlegadaAuto con el mayor tiempoDeOcurrencia
  const eventoMaximo = eventosLlegada.reduce((max, evento) => {
    return evento.tiempoDeOcurrencia > max.tiempoDeOcurrencia ? evento : max;
  });

  // Retornar el tiempoDeOcurrencia del evento con el mayor valor
  console.log("tiempo ocurrencia",eventoMaximo.tiempoDeOcurrencia)
  return eventoMaximo.tiempoDeOcurrencia;
 
}

// Función para obtener el tiempo de ocurrencia del primer evento FinCobro en el arreglo
function obtenerTiempoDeOcurrenciaFinCobro(datos) {
  // Filtrar eventos FinCobro
  const eventosFinCobro = datos.colaEventos.filter(evento => evento instanceof EventoFinCobro);

  // Si hay eventos FinCobro, obtener el tiempo de ocurrencia del primero
  if (eventosFinCobro.length > 0) {
    // Puedes elegir el primer evento o el que tenga el mayor tiempo de ocurrencia
    const primerEvento = eventosFinCobro[0];
    return primerEvento.tiempoDeOcurrencia;
  }

  // Retornar un valor predeterminado si no se encuentran eventos FinCobro
  return undefined; // O puedes retornar un valor predeterminado según tu lógica
}

export default Simulation