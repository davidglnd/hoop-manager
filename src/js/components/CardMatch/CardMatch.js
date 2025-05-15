import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
// import AppCSS from '../../../css/desktop.main.css' with { type: 'css' };
import CardMatchCSS from './cardMatch.css' with { type: 'css' };

export class CardMatch extends LitElement {
    static styles = [ResetCSS,  CardMatchCSS];

    static properties = {
        partido: {type: Object},
        jugadores: {type: Array},
    }

    constructor() {
        super()
        this.partido = {}
        this.jugadores = []
        this.jugadoresSeleccionados = []
        this.mensaje = ''
    }
    _handleSubmit(e){
        e.preventDefault()
        const formData = new FormData(e.target);

        //Creamos la estructura de la convocatoria
        const CONVOCATORIA = {
            jugadores_convocados: [],
            mensaje_convocatoria: '',
            jornada: formData.get('jornada'),
            idEquipo: formData.get('equipo')
        }
        
        //jugadores seleccionados
        const JUGADORES_SELECCIONADOS = formData.getAll('jugadores')
        JUGADORES_SELECCIONADOS.forEach(jugador => {
            const [id, nombre, apellidos] = jugador.split(',')
            CONVOCATORIA.jugadores_convocados.push({
                id: id,
                nombre: nombre,
                apellidos: apellidos
            })
        })
        //Mensaje
        const MENSAJE_CONVOCATORIA = formData.get('mensaje')

        CONVOCATORIA.mensaje_convocatoria = MENSAJE_CONVOCATORIA
        
        this.dispatchEvent(new CustomEvent('convocatoria-creada', {
            detail: CONVOCATORIA,
            bubbles: true,
            composed: true // Necesario si el componente está en shadow DOM
        }));
    }
    render() {
        return html`
            <div class="card">
                <h3>${this.partido.local} vs ${this.partido.visitante}</h3>
                <div class="info">
                    &#128205; <a href="${this.partido.ubicacion}">Pabellon de ${this.partido.local}</a><br><br>
                    &#128197; ${this.partido.fecha} 
                </div>

                <div class="convocatoria">
                    <strong>Convocar jugadores:</strong>
                    <form class="jugadores" @submit=${this._handleSubmit}>
                        ${this.jugadores.map(jugador => html`
                            <label><input type="checkbox" name ="jugadores" value="${jugador._id},${jugador.nombre},${jugador.apellidos}">${jugador.nombre} ${jugador.apellidos}	</label>
                        `)}
                        <input type="hidden" name="jornada" value="${this.partido.jornada}" />
                        <input type="hidden" name="equipo" value="${this.idEquipo}" />
                        <textarea name = "mensaje" placeholder="Mensaje para la convocatoria...">${this.mensaje}</textarea>
                        <button type="submit" >Publicar convocatoria</button>
                    </form>
                </div>
            </div>
        `
    }
}

customElements.define('card-match', CardMatch);