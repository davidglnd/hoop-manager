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
    this.nombre = nombre
    this.siglas = siglas
    this.codigoPostal = codigoPostal
    this.telefono = telefono
    this.email = email
    // this.codigo = siglas + Math.floor(Math.random() * 999)
    this.codigo = codigo
    this.password = password
  }
  }