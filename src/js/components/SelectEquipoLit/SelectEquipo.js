import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData} from '../../utils.js';
import { API_PORT  } from '../../logic/gestion-usuarios-script.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import AppCSS from '../../../css/style.index.css' with { type: 'css' };
import SelectEquipoCSS from './SelectEquipo.css' with { type: 'css' };

export class SelectEquipo extends LitElement {
    static styles = [ResetCSS, AppCSS, SelectEquipoCSS];

    static properties = {
        equipos: {type: Array},
        selectedEquipo: {type: String}
    }

    constructor() {
        super();
        this.equipos = [];
        this.selectedEquipo = '';
    }
    async connectedCallback() {
        super.connectedCallback();

        // Obtenemos el usuario logueado desde sessionStorage
        const userLogeado = JSON.parse(sessionStorage.getItem('HOOP_MANAGER'));

        // Llamamos a la API para obtener los equipos del club asociado al usuario
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/equipos/${userLogeado.clubAsoc}`,'GET');
        
        // Guardamos los equipos en la propiedad reactiva (esto hace que se re-renderice)
        this.equipos = apiData;
    }
    // Manejamos el cambio en el <select>
    _handleChange(e) {
        this.selectedEquipo = e.target.value;
        // Disparamos un CustomEvent para notificar el cambio al exterior
        this.dispatchEvent(new CustomEvent('equipo-cambiado', {
            detail: { equipo: this.selectedEquipo },
            bubbles: true,
            composed: true // Necesario si el componente está en shadow DOM
        }));
    }

    render() {
        return html`
            <select id="select-equipo" @change=${this._handleChange}>
                <!-- Opción inicial deshabilitada -->
                <option disabled selected value="">-- Elige un equipo --</option>

                <!-- Renderizamos cada equipo como una opción -->
                ${this.equipos.map(eq => html`
                <option value="${eq._id}">${eq.nombre}</option>`)}
            </select>
        `
    }


}
customElements.define('lit-select-equipo', SelectEquipo);