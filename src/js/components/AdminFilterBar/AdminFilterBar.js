import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
// import AppCSS from '../../../css/admin/dashboard.css' with { type: 'css' };
import AdminFilterBarCSS from './adminFilterBar.css' with { type: 'css' };

export class AdminFilterBar extends LitElement {
    static properties = {
        opciones: { type: Array },
        boton: { type: Boolean },
    };
    static styles = [ResetCSS,  AdminFilterBarCSS];
    constructor() {
        super();
        this.opciones = [];
    }

    render() {
        let botonHTML = null 
        if(this.boton){
            botonHTML = html`
                <button class="btn-add-icono"  @click=${this._buttonClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 1 0 0-2z"/>
                    </svg>
                    Añadir equipo
                </button>
            `
        }
        return html`
            <p class="admin-filter-bar-title">Filtrar por:</p>
            <menu class="admin-filter-bar">
                <!-- Renderizamos cada parametro como una opción del menu -->
                ${this.opciones.map(opcion => html`
                    <li><p id="menu-p" @click=${this._handleClick}>${opcion}</p></li>
                `)}
                ${botonHTML}
            </menu>
        `;
    }
    _handleClick(e){
        this.shadowRoot.querySelectorAll('#menu-p').forEach(el => el.classList.remove('active'))
        e.target.classList.add('active')
        this.dispatchEvent(new CustomEvent('filter-bar-clicked', { 
            detail: { opcion: e.target.textContent }, 
            bubbles: true, 
            composed: true 
        }))
    }

    _buttonClick(){
        this.shadowRoot.querySelectorAll('#menu-p').forEach(el => el.classList.remove('active'))
        this.dispatchEvent(new CustomEvent('boton-lit-admin-filter-bar', { bubbles: true, composed: true }))
    }
}
customElements.define('lit-admin-filter-bar', AdminFilterBar);