//@ts-check
import { comprobarSession } from '../checkSession.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)


export const API_PORT = location.port ? `:${1337}` : ''


/**
 * Function executed when the DOM content is fully loaded.
 * Initializes event listeners for SignIn and LogIn buttons, and checks for session.
 * 
 * - Retrieves the 'boton-sign-in' and 'boton-log-in' elements and adds event listeners to them.
 * - Retrieves the 'registrarse-usuario' and 'registrarse-club' elements and adds event listeners to them.
 * - Calls comprobarSession() to check if there is an active session.
 * - Logs 'Todo cargado' to the console.
 */
function onDOMContentLoaded() {
    let mostrarSignUsuario = document.getElementById('registrarse-usuario')
    let mostrarSignClub = document.getElementById('registrarse-club')

    mostrarSignUsuario?.addEventListener('click', mostrarSignInUsuario)
    mostrarSignClub?.addEventListener('click', mostrarSignInClub)

    comprobarSession()
    console.log('Todo cargado')
}
function mostrarSignInClub(){
    document.getElementById('comp-sign-in-club')?.classList.remove('hidden')
    document.getElementById('comp-sign-in')?.classList.add('hidden')
}
function mostrarSignInUsuario(){
    document.getElementById('comp-sign-in')?.classList.remove('hidden')
    document.getElementById('comp-sign-in-club')?.classList.add('hidden')
}





