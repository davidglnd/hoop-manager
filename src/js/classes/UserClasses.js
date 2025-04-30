
// @ts-check

/**
 * Clase base para cualquier tipo de usuario.
 */
export class User {
  nombre
  email
  telefono
  password
  rol

  /**
   * @param {string} nombre - Nombre de la persona o club.
   * @param {string} email - Correo electrónico.
   * @param {string} telefono - Teléfono de contacto.
   * @param {string} password - Contraseña.
   * @param {string} rol - Rol del usuario (ADMIN, ENTRENADOR, FAMILIAR, ESTANDAR, FAMILIAR_ESPECIAL).
   */
  constructor(nombre, email, telefono, password, rol) {
    this.nombre = nombre
    this.email = email
    this.telefono = telefono
    this.password = password
    this.rol = rol
  }
}

/**
 * Usuario individual asociado a un club.
 */
export class Usuario extends User {
  apellidos
  clubAsoc

  /**
   * @param {string} nombre
   * @param {string} email
   * @param {string} telefono
   * @param {string} password
   * @param {string} rol - ENTRENADOR, FAMILIAR, ESTANDAR o FAMILIAR_ESPECIAL
   * @param {string} apellidos
   * @param {string} clubAsoc - Código o nombre del club asociado
   */
  constructor(nombre, email, telefono, password, rol, apellidos, clubAsoc) {
    super(nombre, email, telefono, password, rol)
    this.apellidos = apellidos
    this.clubAsoc = clubAsoc
  }
}

/**
 * Representación de un Club deportivo.
 */
export class Club extends User {
  siglas
  codigoPostal
  codigo

  /**
   * @param {string} nombre
   * @param {string} email
   * @param {string} telefono
   * @param {string} password
   * @param {string} siglas
   * @param {string} codigoPostal
   * @param {string} codigo - Identificador único del club
   */
  constructor(nombre, email, telefono, password, siglas, codigoPostal, codigo) {
    super(nombre, email, telefono, password, 'ADMIN') // Los clubs siempre son ADMIN
    this.siglas = siglas
    this.codigoPostal = codigoPostal
    this.codigo = codigo
  }
}
