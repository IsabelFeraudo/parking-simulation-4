export function calcularCostoEstadia(tiempoDeEstadia, tamanoDeAuto) {
  if (tamanoDeAuto === 'utilitario') {
    return 1.5 * tiempoDeEstadia
  } else if (tamanoDeAuto === 'grande') {
    return 1.2 * tiempoDeEstadia
  } else {
    return 1 * tiempoDeEstadia
  }
}