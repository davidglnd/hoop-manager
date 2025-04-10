//@ts-check
export class Equipo {
    _id
    nombre
    categoria
    patrocinador    
    jugadores
    clubAsoc
    /**
     * Constructor de la clase Equipo
     * @param {string} _id - Identificador unico del equipo
     * @param {string} categoria - Categoria del equipo
     * @param {string} patrocinador - Patrocinador del equipo
     * @param {Object} jugadores - Objetos de tipo Jugador que forman parte del equipo
     * @param {string} clubAsoc - The club associated with the user, default is undefined.
     * @param {string} nombre
     */
    constructor(_id, nombre, categoria, patrocinador = "", jugadores = {}, clubAsoc) {
        const timestamp = new Date()
        if (_id === ''){
            this._id = String(timestamp.getTime())
        }else{
            this._id = _id
        }
        this.nombre = nombre
        this.categoria = categoria
        this.patrocinador = patrocinador
        this.jugadores = jugadores
        this.clubAsoc = clubAsoc
    }
}