import { importTemplate } from '../../lib/importTemplate.js';

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
    // this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, SignInFormCSS);
    this._setUpContent();
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
}

customElements.define('sign-in-form-club', SignInFormClub);