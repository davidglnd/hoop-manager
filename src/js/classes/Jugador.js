//@ts-check
export class Jugador {
    nombre
    apellidos
    email
    nTelefono
    direccion
    nombreTutor
    apellidoTutor
/**
 * @param {string} nombre - Nombre del jugador
 * @param {string} apellidos - Apellidos del jugador
 * @param {string} email - Email del jugador
 * @param {string} nTelefono - Número de teléfono del jugador
 * @param {string} direccion - Dirección del jugador
 * @param {string} nombreTutor - Nombre del tutor del jugador
 * @param {string} apellidoTutor - Apellido del tutor del jugador
 */

    constructor(nombre, apellidos, email, nTelefono, direccion, nombreTutor, apellidoTutor){
        this.nombre = nombre
        this.apellidos = apellidos
        this.email = email
        this.nTelefono = nTelefono
        this.direccion = direccion
        this.nombreTutor = nombreTutor
        this.apellidoTutor = apellidoTutor
    }
}
export class JugadorFed extends Jugador {
    /**
     * @param {string} nombre - Nombre del jugador federado
     * @param {string} apellidos - Apellidos del jugador federado
     * @param {string} email - Email del jugador federado
     * @param {string} nTelefono - Número de teléfono del jugador federado
     * @param {string} direccion - Dirección del jugador federado
     * @param {string} nombreTutor - Nombre del tutor del jugador federado
     * @param {string} apellidoTutor - Apellido del tutor del jugador federado
     * @param {string} equipo - Equipo al que pertenece el jugador federado
     */
    constructor(nombre, apellidos, email, nTelefono, direccion, nombreTutor, apellidoTutor,equipo){
        super(nombre, apellidos, email, nTelefono, direccion, nombreTutor, apellidoTutor)
        this.equipo = equipo
    
    }
}