//@ts-check
export class Jugador {
    nombre
    apellidos
    email
    nTelefono
    direccion
    nombreTutor
    apellidoTutor
    _id
/**
 * @param {string} nombre - Nombre del jugador
 * @param {string} apellidos - Apellidos del jugador
 * @param {string} email - Email del jugador
 * @param {string} nTelefono - Número de teléfono del jugador
 * @param {string} direccion - Dirección del jugador
 * @param {string} nombreTutor - Nombre del tutor del jugador
 * @param {string} apellidoTutor - Apellido del tutor del jugador
 * @param {string} _id - Identificador del jugador
 */

    constructor(nombre, apellidos, email, nTelefono, direccion, nombreTutor, apellidoTutor,_id){
        this.nombre = nombre
        this.apellidos = apellidos
        this.email = email
        this.nTelefono = nTelefono
        this.direccion = direccion
        this.nombreTutor = nombreTutor
        this.apellidoTutor = apellidoTutor
        if (_id === ''){
            const timestamp = new Date()
            this._id = String(timestamp.getTime())
        }else{
            this._id = _id
        }
    }
}