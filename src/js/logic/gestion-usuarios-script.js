import { Club } from '../classes/Club.js'
import { comprobarSession } from '../checkSession.js'
import { getAPIData } from '../utils.js'

//import club from '../api/clubes.json' with { type: "json" }

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)


export const API_PORT = location.port ? `:${1337}` : ''




/**
 * Evento que se lanza cuando el contenido de la pagina ha sido cargado en memoria
 * y se puede acceder a el.
 * 
 * Asigna los eventos que se observan a partir de que cargue la pagina:
 * - Al formulario, se le asigna el evento "submit" que llama a la funcion
 *   tomarDatos.
 * Luego, llama a la funcion leerBD para leer la base de datos de usuarios
 * y guardarla en el array USER_DB.
 * 
 * @returns {void}
 */
function onDOMContentLoaded() {
    let formularioClub = document.getElementById('registro-club')

    let logInUsuario = document.getElementById('log-in-usuario')
    let logInClub = document.getElementById('log-in-club')

    let botonSignIn = document.getElementById('boton-sign-in')
    let botonLogIn = document.getElementById('boton-log-in')

    let mostrarSignUsuario = document.getElementById('registrarse-usuario')
    let mostrarSignClub = document.getElementById('registrarse-club')

    //La interrogacion vale para ver si existe el form 
    logInUsuario?.addEventListener('submit', datosLogIn)//si no no hace el eventListener
    
    formularioClub?.addEventListener('submit', datosSignClub)


    logInClub?.addEventListener('submit', datosLogInClub)

    mostrarSignUsuario?.addEventListener('click', mostrarSignInUsuario)
    mostrarSignClub?.addEventListener('click', mostrarSignInClub)

    botonLogIn?.addEventListener('click', mostrarLogIn)
    botonSignIn?.addEventListener('click', mostrarSignIn)

    comprobarSession()
    console.log('Todo cargado')
}
function mostrarLogIn(){
    document.getElementById('comp-log-in')?.classList.remove('hidden')
    document.getElementById('contenedor-sign-in')?.classList.add('hidden')
    document.getElementById('boton-log-in')?.classList.add('hidden')
    document.getElementById('boton-sign-in')?.classList.add('hidden')
}
function mostrarSignIn(){
    document.getElementById('contenedor-sign-in')?.classList.remove('hidden')
    document.getElementById('contenedor-log-in')?.classList.add('hidden')
    document.getElementById('boton-log-in')?.classList.add('hidden')
    document.getElementById('boton-sign-in')?.classList.add('hidden')
}
function mostrarSignInClub(){
    document.getElementById('comp-sign-in-club')?.classList.remove('hidden')
    document.getElementById('comp-sign-in')?.classList.add('hidden')
}
function mostrarSignInUsuario(){
    document.getElementById('comp-sign-in')?.classList.remove('hidden')
    document.getElementById('comp-sign-in-club')?.classList.add('hidden')
}
/**
 * Event handler for the club registration form. Prevents the default form
 * submission action and creates a new Club object with the data from the
 * form. Then, it saves the club data to local storage using the key
 * 'CLUB_DB'.
 * @param {Event} event - The event that triggered this function
 */
function datosSignClub(event){
    event.preventDefault()

    let nombre = /** @type {HTMLInputElement} */(document.getElementById('nombre-club'))?.value
    let siglas = /** @type {HTMLInputElement} */(document.getElementById('siglas-club'))?.value
    let codigoPostal = /** @type {HTMLInputElement} */(document.getElementById('codigo-club'))?.value
    let telClub = /** @type {HTMLInputElement} */(document.getElementById('tel-club'))?.value
    let emailClub = /** @type {HTMLInputElement} */(document.getElementById('email-club'))?.value
    let passwordClub = /** @type {HTMLInputElement} */(document.getElementById('password-club'))?.value

    crearClub(nombre,siglas,codigoPostal,telClub,emailClub,passwordClub)
}
/**
 * Takes the data from the form and uses it to log in the user.
 * It then calls the logIn function to log in the user.
 * @param {Event} event - the event that triggered this function.
 */
function datosLogIn(event){
    event.preventDefault()

    let emailInput = document.getElementById('email-usuario')
    let passwordInput = document.getElementById('pass-usuario-log-in')

    let email = /** @type {HTMLInputElement} */(emailInput)?.value
    let password = /** @type {HTMLInputElement} */(passwordInput)?.value

    let loginUser ={email: email, password: password}
    
    logIn(loginUser)
}
/**
 * Takes the data from the form and uses it to log in the club.
 * It then calls the logInClub function to log in the club.
 * @param {Event} event - the event that triggered this function.
 */
function datosLogInClub(event){
    event.preventDefault()
    console.log('log in club')
    let emailInput = document.getElementById('email-club-log-in')
    let passwordInput = document.getElementById('pass-club-log-in')

    let email = /** @type {HTMLInputElement} */(emailInput)?.value
    let passwordClub = /** @type {HTMLInputElement} */(passwordInput)?.value

    let loginClub = new Club('','','','','',email,'',passwordClub)

    logInClub(loginClub)
}
/**
 * Crea un nuevo club con los datos proporcionados y lo almacena en
 * local storage con la clave 'CLUB_DB'.
 * @param {string} nombre - Nombre del club
 * @param {string} siglas - Siglas del club
 * @param {string} codigoPostal - Codigo del club
 * @param {string} telClub - Telefono del club
 * @param {string} emailClub - Email del club
 * @param {*} [password] - Contraseña
 */
async function crearClub(nombre,siglas,codigoPostal,telClub,email,password){
    let checkClubExist =new Club(nombre,siglas,codigoPostal,telClub,email,'',password)
    const payload = JSON.stringify(checkClubExist)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/clubs`, 'POST', payload)
    console.log(apiData.error)
    if(apiData.error){
        document.getElementById('error-registro-club').innerText = apiData.error
        document.getElementById('error-registro-club')?.classList.remove('hidden')
        setTimeout(() => {
        document.getElementById('error-registro')?.classList.add('hidden')
        }, 2000)
        return
    }else{
        document.getElementById('registrado-club')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('registrado-club')?.classList.add('hidden')
            location.href = '/index.html'
        }, 2000)

        console.log('Respuesta del servidor de APIs', apiData)
    }
}
/**
 * Handles the user login process upon form submission, preventing the default form behavior.
 * If the user is not logged in and the login data is correct, it logs in the user, saves the user session data, and redirects to the club page.
 * If the login data is incorrect, it shows an error message to the user.
 *
 * @param {User} loginUser - The user object containing the user data to be logged in.
 */
async function logIn(loginUser){
    const payload = JSON.stringify(loginUser)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
    console.log(apiData.message)
    if(!apiData.error){
        console.log('Usuario logeado : ' + apiData.name)
        sessionStorage.setItem('HOOP_MANAGER', JSON.stringify(apiData))
        location.href = '/club.html'
    }else{
        //gestion de error para el usuario
        document.getElementById('error-login')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('error-login')?.classList.add('hidden')
        }, 2000)

        if (/** @type {any} */(apiData)?.error === true) {
            console.error(/** @type {any} */(apiData)?.message)
            return
        }
    }

}

/**
 * Handles the club login process by sending the club data to the server.
 * If the login is successful, it logs the club in, saves the club session data,
 * and redirects to the admin club page. If the login fails, it displays an 
 * error message to the user.
 *
 * @param {Club} loginClub - The club object containing the club data to be logged in.
 */

async function logInClub(loginClub){ // TO DO CARGARME ESTO FUSIONANDO MODELO DE DATOS USERS Y CLUBS
    const payload = JSON.stringify(loginClub)

    const apiData = JSON.parse(await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/loginClub`, 'POST', payload))

    if(apiData.length >=0){
        console.log('Club logeado : ' + apiData[0].nombre)
        sessionStorage.setItem('HOOP_MANAGER_CLUB', apiData[0]._id)
        location.href = '/admin-club.html'
    }else{
        //gestion de error para el usuario
        document.getElementById('error-login-club')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('error-login-club')?.classList.add('hidden')
        }, 2000)

        if (/** @type {any} */(apiData)?.error === true) {
            console.error(/** @type {any} */(apiData)?.message)
            return
        }
    }
}





