//@ts-check
export class Jugador {
    _id_familiar
    nombre
    apellidos
    fnac
    sexo
    posicion
    categoria
    email
    nTelefono
    direccion

    /**
     * Constructor de la clase Jugador
     * @param {string} _id_familiar - Identificador unico del familiar
     * @param {string} nombre - Nombre del jugador
     * @param {string} apellidos - Apellidos del jugador
     * @param {string} fnac - Fecha de nacimiento del jugador
     * @param {string} sexo - Sexo del jugador
     * @param {string} [posicion='por definir'] - Posicion del jugador en el campo
     * @param {string} [categoria=''] - Categoria del jugador
     * @param {string} [email=''] - Email del jugador
     * @param {string} [nTelefono=''] - Numero de telefono del jugador
     * @param {string} direccion - Direccion del jugador
     * @param {string} club
     */
    constructor(_id_familiar='',nombre,apellidos,fnac,sexo,direccion,club,posicion = 'por definir',categoria = '',email = '',nTelefono = ''){
        this._id_familiar = _id_familiar
        this.nombre = nombre
        this.apellidos = apellidos
        this.fnac = fnac
        this.sexo = sexo
        this.posicion = posicion
        this.categoria = categoria
        this.email = email
        this.nTelefono = nTelefono
        this.direccion = direccion
        this.club = club
    }
}