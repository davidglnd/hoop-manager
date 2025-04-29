//@ts-check
export class Equipo {
    nombre
    categoria
    patrocinador    
    jugadores
    clubAsoc
    /**
     * Constructor de la clase Equipo
     * @param {string} categoria - Categoria del equipo
     * @param {string} patrocinador - Patrocinador del equipo
     * @param {Object} jugadores - Objetos de tipo Jugador que forman parte del equipo
     * @param {string} clubAsoc - The club associated with the user, default is undefined.
     * @param {string} nombre
     */
    constructor(nombre, categoria, patrocinador = "", jugadores = {}, clubAsoc) {
        this.nombre = nombre
        this.categoria = categoria
        this.patrocinador = patrocinador
        this.jugadores = jugadores
        this.clubAsoc = clubAsoc
    }
}