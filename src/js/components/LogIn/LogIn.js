import { importTemplate } from '../../lib/importTemplate.js';
import { getAPIData} from '../../utils.js';
import { API_PORT  } from '../../gestion-usuarios-script.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import AppCSS from '../../../css/style.index.css' with { type: 'css' };
import LogInCSS from './LogIn.css' with { type: 'css' };

const TEMPLATE = {
  id: 'logInFormTemplate',
  url: './js/components/LogIn/LogIn.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * Sign In Form Web Component
 *
 * @class SignInForm
 * @extends HTMLElement
 */
export class LogInForm extends HTMLElement {
  get template(){
    return document.getElementById(TEMPLATE.id);
  }

  constructor() {
    super();
    // Configuramos nuestro componente
    console.log('1. instanciando LogInForm');
  }

  // ======================= Lifecycle Methods ======================= //

  /**
   * Called when the element is inserted into a document.
   * The element is already attached to its parent node.
   */
  async connectedCallback() {
    console.log("2. constructor: Custom element added to page.");
    // Necesitamos activar el shadow DOM para poder añadir la plantilla html
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, LogInCSS);
    this._setUpContent();
    const logInForm = this.shadowRoot.getElementById("log-in");
    logInForm.addEventListener("submit", this._submitLogIn.bind(this));
  }

  // ======================= Private Methods ======================= //

  /**
  * Private method to set up the content of the web component.
  *
  * Only render if the web component is connected and the template is loaded.
  * Replace any previous content with the template content.
  * @private
  */
 _setUpContent() {
   // Prevent render when disconnected or the template is not loaded
   if (this.shadowRoot && this.template) {
     // Replace previous content
     this.shadowRoot.innerHTML = '';
     this.shadowRoot.appendChild(this.template.content.cloneNode(true));
   }
 }
 async _submitLogIn(e) {
    e.preventDefault();

    const email = this.shadowRoot.getElementById('email-usuario').value;
    const password = this.shadowRoot.getElementById('pass-usuario-log-in').value;

    const payload = JSON.stringify({email, password});
    
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
    
    if(!apiData.error){
        console.log('Usuario logeado : ' + apiData.name)
        sessionStorage.setItem('HOOP_MANAGER', JSON.stringify(apiData))
        if(apiData.rol === "ADMIN"){
            location.href = '/admin-club.html'
        }else{
            location.href = '/club.html'
        }
    }else{
        //gestion de error para el usuario
        this.shadowRoot.getElementById('error-login')?.classList.remove('hidden')
        setTimeout(() => {
            this.shadowRoot.getElementById('error-login')?.classList.add('hidden')
        }, 2000)
        
        if (/** @type {any} */(apiData)?.error === true) {
            console.error(/** @type {any} */(apiData)?.message)
            return
        }
    }
 }
}

customElements.define('log-in-usuario', LogInForm);