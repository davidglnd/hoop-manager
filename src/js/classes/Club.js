// @ts-check
export class Club {
    nombre
    siglas
    codigoPostal
    telefono
    email
    codigo
    /**
     * @param {string} nombre - nombre del club
     * @param {string} siglas - siglas del club
     * @param {string} codigoPostal - pin del club
     * @param {string} telefono - telefono del club
     * @param {string} email - email del club
     * @param {number} [codigo = 0] - codigo del club
     */
    constructor(nombre, siglas, codigoPostal, telefono, email, codigo) {
      this.nombre = nombre
      this.siglas = siglas
      this.codigoPostal = codigoPostal
      this.telefono = telefono
      this.email = email
      this.codigo = codigo
    }
  }