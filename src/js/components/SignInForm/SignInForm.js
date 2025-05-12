import { importTemplate } from '../../lib/importTemplate.js';
import { getAPIData} from '../../utils.js';
import { API_PORT  } from '../../logic/gestion-usuarios-script.js';
import { Usuario } from '../../classes/UserClasses.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import AppCSS from '../../../css/style.index.css' with { type: 'css' };
import SignInFormCSS from './SignInForm.css' with { type: 'css' };

const TEMPLATE = {
  id: 'signInFormTemplate',
  url: './js/components/SignInForm/SignInForm.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * Sign In Form Web Component
 *
 * @class SignInForm
 * @extends HTMLElement
 */
export class SignInForm extends HTMLElement {
  // Definimos las propiedades del componente
  _color = 'rojo';

  // Propiedades dinámicas
  set color(value) {
    this._color = value + ' claro';
  }
  get color() {
    return this._color;
  }
  get template(){
    return document.getElementById(TEMPLATE.id);
  }

  constructor() {
    super();
    // Configuramos nuestro componente
    this.color = 'azul';
    console.log('1. instanciando SignInForm', this.color);
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
    const signInForm = this.shadowRoot.getElementById("sig-in");
    signInForm.addEventListener("submit", this._submitSignInin.bind(this));
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
 async _submitSignInin(e){
  e.preventDefault()
  const name = this.shadowRoot.getElementById('usuario').value
  const apellidos = this.shadowRoot.getElementById('apellidos').value
  const email = this.shadowRoot.getElementById('email').value
  const password = this.shadowRoot.getElementById('password-usuario').value
  const telefono = this.shadowRoot.getElementById('n-telefono').value
  const codClub = this.shadowRoot.getElementById('cod-club').value

  const userLogIng = new Usuario(name, email,telefono,password,apellidos,codClub)

  const payload = JSON.stringify(userLogIng)

  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/users`, 'POST', payload)

    if(apiData.error){
        this.shadowRoot.getElementById('error-registro')?.classList.remove('hidden')
        this.shadowRoot.getElementById('error-registro').innerText = apiData.error
        setTimeout(() => {
          this.shadowRoot.getElementById('error-registro')?.classList.add('hidden')
        }, 2000)
        return
    }else{
      this.shadowRoot.getElementById('registrado')?.classList.remove('hidden')
        setTimeout(() => {
          this.shadowRoot.getElementById('registrado')?.classList.add('hidden')
            //location.href = '/index.html'
        }, 2000)

        console.log('Respuesta del servidor de APIs', apiData)
    }
  }
}

customElements.define('signin-form', SignInForm);