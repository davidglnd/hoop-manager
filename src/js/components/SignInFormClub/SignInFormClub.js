import { importTemplate } from '../../lib/importTemplate.js';
import { getAPIData} from '../../utils.js';
import { API_PORT  } from '../../gestion-usuarios-script.js';
import { Club } from '../../classes/UserClasses.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import AppCSS from '../../../css/style.index.css' with { type: 'css' };
import SignInFormCSS from './SignInFormClub.css' with { type: 'css' };

const TEMPLATE = {
  id: 'signInFormClubTemplate',
  url: './js/components/SignInFormClub/SignInFormCLub.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * Sign In Form Web Component
 *
 * @class SignInForm
 * @extends HTMLElement
 */
export class SignInFormClub extends HTMLElement {
  // Definimos las propiedades del componente


  // Propiedades dinámicas
  get template(){
    return document.getElementById(TEMPLATE.id);
  }

  constructor() {
    super();
    // Configuramos nuestro componente
    console.log('1. instanciando SignInFormClub');
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
    this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, SignInFormCSS);
    this._setUpContent();
    const signInForm = this.shadowRoot.getElementById("registro-club");
    signInForm.addEventListener("submit", this.__submitSignIninClub.bind(this));
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
async __submitSignIninClub(e){
  e.preventDefault()
  const name = this.shadowRoot.getElementById('nombre-club').value
  const email = this.shadowRoot.getElementById('email-club').value
  const password = this.shadowRoot.getElementById('password-club').value
  const telefono = this.shadowRoot.getElementById('tel-club').value
  const siglas = this.shadowRoot.getElementById('siglas-club').value
  const codigoPostal = this.shadowRoot.getElementById('codigo-club').value

  const clubLogIng = new Club(name, email,telefono,password, siglas, codigoPostal, '')

  const payload = JSON.stringify(clubLogIng)

  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/clubs`, 'POST', payload)

    if(apiData.error){
        this.shadowRoot.getElementById('error-registro-club')?.classList.remove('hidden')
        this.shadowRoot.getElementById('error-registro-club').innerText = apiData.error
        setTimeout(() => {
          this.shadowRoot.getElementById('error-registro-club')?.classList.add('hidden')
        }, 2000)
        return
    }else{
      this.shadowRoot.getElementById('registrado-club')?.classList.remove('hidden')
        setTimeout(() => {
          this.shadowRoot.getElementById('registrado-club')?.classList.add('hidden')
            //location.href = '/index.html'
        }, 2000)

        console.log('Respuesta del servidor de APIs', apiData)
    }

  }
}
customElements.define('sign-in-form-club', SignInFormClub);