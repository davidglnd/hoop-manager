//@ts-check
export class User {
  name
  email
  apellidos
  nTelefono
  rol = 'basico'
/**
 * Creates an instance of User.
 * 
 * @param {string} name - The first name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} apellidos - The surname(s) of the user.
 * @param {string} nTelefono - The phone number of the user.
 * @param {string} [rol='basico'] - The role of the user, default is 'basico'.
 */

  constructor(name, email, apellidos, nTelefono, rol = 'basico') {
    this.name = name
    this.email = email
    this.apellidos = apellidos
    this.nTelefono = nTelefono
    this.rol = rol
  }
}