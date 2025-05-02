// @ts-check
export class Calendario {
    /**
     * Constructor de la clase Calendario
     * @param {string} equipoId - ID del equipo al que pertenece este calendario
     * @param {string} categoria - Categoria del equipo
     * @param {string} temporada - Temporada de la que se trata
     */
    constructor(equipoId, categoria, temporada) {
      this.equipoId = equipoId;       // ID del equipo al que pertenece este calendario
      this.categoria = categoria;
      this.temporada = temporada;
      this.partidos = [];
    }
}