import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CardConvocatoriaCSS from './cardConvocatoria.css' with { type: 'css' };

export class CardConvocatoria extends LitElement {
    static styles = [ResetCSS, CardConvocatoriaCSS];
    
    static properties = {
        jornada: {type: String},
        fecha: {type: String},
        ubicacion: {type: String},
        jugadores: {type: Array},
        equipos: {type: Array},
        mensaje: {type: String}
    }

    constructor() {
        super();
        this.jornada = '';
        this.fecha = '';
        this.ubicacion = '';
        this.jugadores = [];
        this.equipos = [];
        this.mensaje = '';
    }

    render() {
        return html`
            <div class="card">
                <h3>Jornada ${this.jornada}</h3>
                <div class="info">
                    <h4>${this.equipos[0]} vs ${this.equipos[1]}</h4>
                    &#128205; Pabellon de ${this.ubicacion}<br><br>
                    &#128197; ${this.fecha} 
                </div>

                <div class="jugadores">
                    ${this.jugadores.map(jugador => html`<p>${jugador.nombre} ${jugador.apellidos}</p>`)}
                </div>

                <div class="mensaje">
                    ${this.mensaje}
                </div>
            </div>
        `
    }
}

customElements.define('card-convocatoria', CardConvocatoria);