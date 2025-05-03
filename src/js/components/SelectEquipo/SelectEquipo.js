import { importTemplate } from '../../lib/importTemplate.js';
import { getAPIData} from '../../utils.js';
import { API_PORT  } from '../../gestion-usuarios-script.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import AppCSS from '../../../css/style.index.css' with { type: 'css' };
import SelectEquipoCSS  from './SelectEquipo.css' with { type: 'css' };

const TEMPLATE = {
    id: 'selectEquipoTemplate',
    url: './js/components/SelectEquipo/SelectEquipo.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

export class SelectEquipo extends HTMLElement {
    
    get template(){
        return document.getElementById(TEMPLATE.id);
    }
    
    constructor() {
        super();
        console.log('1. instanciando SelectEquipo');
    }

    async connectedCallback() {
        console.log("2. añadiendo la instancia de SelectEquipo.");
        // Necesitamos activar el shadow DOM para poderañadir la plantilla html
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, SelectEquipoCSS);
        this._setUpContent();
        const selectEquipo = this.shadowRoot.getElementById("select-equipo");
        await this._pintarSelect(selectEquipo);



    }

    _setUpContent(){
        // Prevent render when disconnected or the template is not loaded
        if (this.shadowRoot && this.template) {
            // Replace previous content
            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        }
    }
    async _pintarSelect(selectEquipo){
        //Obetenemos el usuario logeado del sessionStorage
        const userLogeado = JSON.parse(sessionStorage.getItem('HOOP_MANAGER'));
        
        //Obtenemos la lista de equipos asociadas al club del ususario logeado
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/equipos/${userLogeado.clubAsoc}`, 'GET')
        
        //Pintamos la lista de equipos en el select
        apiData.forEach((equipo) => {
            let option = document.createElement('option')
            option.value = equipo._id
            option.innerText = equipo.nombre
            selectEquipo.appendChild(option)
        });
        //Añadimops el customEvent para escucharlo en el main js
        selectEquipo.addEventListener('change', () => {
            const seleccionado = selectEquipo.value;
      
            this.dispatchEvent(new CustomEvent('equipo-cambiado', {
              detail: { equipo: seleccionado },
              bubbles: true,
              composed: true // <- necesario si está en shadow DOM
            }));
          });
    }
}
customElements.define('select-equipo', SelectEquipo);