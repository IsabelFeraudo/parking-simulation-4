export class Auto {
  constructor(tamano, id, estado, lugar, costo) {
    this.id = id
    this.tamano = tamano // pequeño
    this.estado = estado // estacionado, esperando pagar, pagando
    this.lugar = lugar // { tipo: grande }
    this.costo = costo
  }
}