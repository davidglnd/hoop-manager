//@ts-check
export class User {
  name
  email
  apellidos
  nTelefono
  clubAsoc
  rol = 'basico'
/**
 * Creates an instance of User.
 * 
 * @param {string} name - The first name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} apellidos - The surname(s) of the user.
 * @param {string} nTelefono - The phone number of the user.
 * @param {string} [rol='basico'] - The role of the user, default is 'basico'.
 * @param {string} clubAsoc - The club associated with the user, default is undefined.
 */

  constructor(name, email, apellidos, nTelefono, clubAsoc, rol = 'basico') {
    this.name = name
    this.email = email
    this.apellidos = apellidos
    this.nTelefono = nTelefono
    this.clubAsoc = clubAsoc
    this.rol = rol
  }
}