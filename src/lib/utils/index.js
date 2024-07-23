export function tamanoDeAuto(random) {
  if (random < 0.6) {
    return 'pequeño'
  } else if (random < 0.85) {
    return 'grande'
  } else {
    return 'utilitario'
  }
}

export function insertarEvento(eventosCola, nuevoEvento) {
  // Insertar el nuevo evento en la cola
  eventosCola.push(nuevoEvento);
  // Ordenar la cola de eventos por tiempo de ocurrencia
  eventosCola.sort((a, b) => a.tiempoDeSiguienteOcurrencia - b.tiempoDeSiguienteOcurrencia);
}

export function calcularTiempoDeEstadia(random) {
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

export function calcularCostoEstadia(tiempoDeEstadia, tamanoDeAuto) {
  if (tamanoDeAuto === 'utilitario') {
    return 1.5 * tiempoDeEstadia
  } else if (tamanoDeAuto === 'grande') {
    return 1.2 * tiempoDeEstadia
  } else {
    return 1 * tiempoDeEstadia
  }
}