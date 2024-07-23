export class Lugar {
  constructor(parking_size, ocupados) {
    this.parking_size = parking_size // grande, pequeño, utilitario (use PARKING_SIZE constant)
    this.ocupados = ocupados // 0, 1, 2 (use PARKING_AVAILABILITY constant)
  }
}