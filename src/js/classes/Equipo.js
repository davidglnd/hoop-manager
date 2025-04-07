//@ts-check
export class Equipo {
    _id
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
     */
    constructor(_id, categoria, patrocinador = "", jugadores = {}, clubAsoc) {
        if (_id === ''){
            this._id = clubAsoc + '.' + categoria
        }else{
            this._id = _id
        }
        this.categoria = categoria
        this.patrocinador = patrocinador
        this.jugadores = jugadores
        this.clubAsoc = clubAsoc
    }
}