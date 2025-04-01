//@ts-check
export class User {
  name
  email
  /**
   * Constructor de la clase User
   * @param {string} name - El nombre del usuario
   * @param {string} email - El email del usuario
   */
  constructor(name, email) {
    this.name = name
    this.email = email
  }
}