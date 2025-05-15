import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData} from '../../utils.js';
import { API_PORT  } from '../../logic/gestion-usuarios-script.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
// import AppCSS from '../../../css/desktop.main.css' with { type: 'css' };
import LogInCSS from './LogIn.css' with { type: 'css' };

export class LogInLit extends LitElement {
    static styles = [ResetCSS,  LogInCSS];

    static properties = {
      email: {type: String},
      password: {type: String}
    };

    constructor() {
        super();
    }

    render(){
        return html`
            <form id="log-in" class="hidden" @submit="${this._submitLogIn}">
                <label for="email">Email</label>
                <input type="email" id="email-usuario">
                <label for="pass-usuario-log-in">Constraseña</label>
                <input type="password" id="pass-usuario-log-in">
                <button type="submit">Iniciar sesion</button>
                <p id="error-login" class="hidden">Inicio de sesion incorrecto</p>
            </form>
        `
    }
    async _submitLogIn(e) {
        e.preventDefault();
    
        const email = this.renderRoot.getElementById('email-usuario').value;
        const password = this.renderRoot.getElementById('pass-usuario-log-in').value;
    
        const payload = JSON.stringify({email, password});
        
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
        
        if(!apiData.error){
            console.log('Usuario logeado : ' + apiData.name)
            sessionStorage.setItem('HOOP_MANAGER', JSON.stringify(apiData))
            if(apiData.rol === "ADMIN"){
                location.href = 'admin/admin-club.html'
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
customElements.define('login-form', LogInLit);