// @ts-check
export class Club {
    nombre
    siglas
    codigoPostal
    telefono
    email
    codigo
    password
    /**
   * @param {string} nombre - nombre del club
   * @param {string} siglas - siglas del club
   * @param {string} codigoPostal - pin del club
   * @param {string} telefono - telefono del club
   * @param {string} email - email del club
   * @param {string} codigo - codigo del club
   * @param {string} password - password del club
   */
    constructor(nombre, siglas, codigoPostal, telefono, email, codigo, password) {
      const timestamp = new Date()
      //generamos id aleatorio
      this.id = String(timestamp.getTime())
      this.nombre = nombre
      this.siglas = siglas
      this.codigoPostal = codigoPostal
      this.telefono = telefono
      this.email = email
      this.codigo = codigo
      this.password = password
    }
  }