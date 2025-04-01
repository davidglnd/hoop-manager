//@ts-check
import { User } from '../js/classes/User.js'
import { SingletonDB } from '../js/classes/SingletonDB.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)

const USER_DB = new SingletonDB()

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
    let formularioRegistro = document.getElementById('sig-in')
    let formularioLogin = document.getElementById('log-in')
    let formularioBorrado = document.getElementById('borrar-usuario')
    formularioRegistro?.addEventListener('submit', datosSigIN)//La interrogacion vale para ver si existe el form 
    formularioLogin?.addEventListener('submit', datosLogIn)//si no no hace el eventListener
    formularioBorrado?.addEventListener('submit', borrarUsuario)
    leerBD()
    comprobarSession()
}
/**
 * Takes the data from the form and creates a new User object with that data.
 * It then adds that User to the USER_DB array and calls the registrarUsuario function to save the USER_DB array to local storage.
 * @param {Event} event - the event that triggered this function.
 */
function datosSigIN(event) {
    event.preventDefault()

    let name = /** @type {HTMLInputElement} */(document.getElementById('usuario'))?.value
    let email = /** @type {HTMLInputElement} */(document.getElementById('email'))?.value

    crearUsuario(name,email)
    
}
/**
 * Takes the data from the form and uses it to log in the user.
 * It then calls the logIn function to log in the user.
 * @param {Event} event - the event that triggered this function.
 */
function datosLogIn(event){
    event.preventDefault()

    let usuarioInput = document.getElementById('usuario-login')
    let emailInput = document.getElementById('email-login')

    let usuario =/** @type {HTMLInputElement} */(usuarioInput)?.value
    let email = /** @type {HTMLInputElement} */(emailInput)?.value
    
    logIn(usuario,email)//ojo al orden en el qe enviamos los parametros 
}
/**
 * Creates a new User instance and adds it to the USER_DB array.
 * This function takes a user's name and email, constructs a User
 * object, and stores it in the user database. It then calls the
 * registrarUsuario function to save the updated database to local storage.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 */
function crearUsuario(name,email){
    let nuevoUsuario = new User(name, email)
    if(USER_DB.get().findIndex((user) => user.email === email) >= 0){
        console.log('error registro')
        document.getElementById('error-registro')?.classList.remove('hidden')//estilos
        setTimeout(() => {
            document.getElementById('error-registro')?.classList.add('hidden')
        }, 2000)
        return
    }
        console.log('ok registro')
        //estilos
        document.getElementById('registrado')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('registrado')?.classList.add('hidden')
        }, 2000)
        
        USER_DB.push(nuevoUsuario)
        registrarUsuario()
    
    
    
}
/**
 * Saves the current state of the USER_DB array to local storage.
 * 
 * This function serializes the USER_DB array into a JSON string
 * and stores it in local storage under the key 'USER_DB'.
 * This allows the user database to be persisted across sessions.
 */
function registrarUsuario(){
    localStorage.setItem('USER_DB', JSON.stringify(USER_DB.get()))
}
/**
 * Handles the user deletion process upon form submission, preventing the default form behavior.
 * If a user is logged in and confirms the deletion, it removes the user from the USER_DB,
 * updates the local storage, deletes the user session data, and redirects to the home page.
 *
 * @param {Event} event - The event object associated with the form submission.
 */
function borrarUsuario(event){
    event.preventDefault()

    if(sessionStorage.getItem('user') && confirm('¿Estas seguro de borrar tu usuario?')){
        let usuarioLogeado = sessionStorage.getItem('user')
        // Si no existe la clave 'user' en la sesión, localStoredUser es null
        if(usuarioLogeado === null){
            // Asignamos una cadena de texto vacía porque JSON.parse() se rompe con un null
            usuarioLogeado = ''
        }
        USER_DB.borrarUsuario(JSON.parse(usuarioLogeado).email)
        registrarUsuario()//cambiar nombre de la function
        sessionStorage.removeItem('user')
        location.href = '/index.html'
    }

}
/**
 * Logs in a user by checking their credentials against the USER_DB.
 * 
 * This function retrieves the user's name and email from the login form,
 * searches for a matching user in the USER_DB, and if found, stores the 
 * user in session storage and updates the UI to indicate a successful login.
 * If the user is not found, it updates the UI to show an error message.
 * 
 * @param {string} usuario - The username entered in the login form.
 * @param {string} email - The email entered in the login form.
 * @returns {void}
 */
function logIn(usuario,email){
    console.log(USER_DB.get())
    if(USER_DB.get().findIndex((user) => user.name === usuario && user.email === email) >= 0){
        console.log('log in')
        sessionStorage.setItem('user', JSON.stringify(USER_DB.get()[USER_DB.get().findIndex((user) => user.name === usuario && user.email === email)]))
        //estilos
        document.getElementById('log-correcto')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('log-correcto')?.classList.add('hidden')
        }, 2000)
        comprobarSession()
    }else{
        console.log('no existe el usuario')
        //estilos
        document.getElementById('error-login')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('error-login')?.classList.add('hidden')
        }, 2000)
        
    }
    
    
}
/**
 * Reads the user database from local storage and updates the USER_DB array.
 * 
 * This function checks if there is a 'USER_DB' entry in the local storage.
 * If present, it parses the JSON string into an array of users and appends
 * these users to the existing USER_DB array.
 * 
 * This ensures that the USER_DB array is populated with the latest data
 * from previous sessions on page load.
 */
function leerBD(){
    let listaUsuarios = []

    // comprobamos si hay algo en localstorage
    if(localStorage.getItem('USER_DB')){
        let listaUsuariosDB = localStorage.getItem('USER_DB')

        if(listaUsuariosDB === null){
            // Asignamos una cadena de texto vacía, para no romper JSON.parse()
            listaUsuariosDB = ''
        } //ejemplo en clase: me parece redundante ya que al entrar en el primer if sabemos que no es null

        listaUsuarios = JSON.parse(listaUsuariosDB)
        .map((/** @type {User} */ user) => new User(user.name, user.email))
    }
    if(USER_DB.get() === undefined){
        console.log('inicializo el singleton de la base de datos')
    }
    USER_DB.push(...listaUsuarios)
}
/**
 * Checks if the user is logged in by verifying session storage for user data.
 * If a user is logged in, it updates the UI to show the user link and log out form,
 * while hiding the sign-in and log-in forms. If no user is logged in and the current
 * page is not the home page, it redirects to the home page.
 */
function comprobarSession(){
    if(sessionStorage.getItem('user') !== null){
        console.log('estas login')
        document.getElementById('sigIn')?.classList.add('hidden')
        document.getElementById('logIn')?.classList.add('hidden')
        document.getElementById('ir-perfil')?.classList.remove('hidden')
    } else if (location.pathname !== '/index.html') {
        // Redirigimos a la home si el usuario no está identificado
        location.href = '/index.html'
    }
}
