
import { User } from './classes/User.js'
import { Club } from './classes/Club.js'
import { SingletonDB } from './classes/SingletonDB.js'
import { INITIAL_STATE, store } from './store/redux.js'
import { comprobarSession } from './checkSession.js'
import { HttpError } from './classes/HttpError.js'
import { simpleFetch } from './lib/simpleFetch.js'

//import club from '../api/clubes.json' with { type: "json" }

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)
// TO DO desacernos por completo del ClubDB e implementarlo a traves de redux y el store (solo falta en borrar usuario que hace
// falta implementarlo primero en el html )
const USER_DB = new SingletonDB()

const API_PORT = location.port ? `:${1337}` : ''
const TIMEOUT = 10000



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
    let formularioClub = document.getElementById('registro-club')

    let logInUsuario = document.getElementById('log-in-usuario')
    let logInClub = document.getElementById('log-in-club')

    let botonSignIn = document.getElementById('boton-sign-in')
    let botonLogIn = document.getElementById('boton-log-in')
    let mostrarLogUsuario = document.getElementById('iniciar-sesion-usuario')
    let mostrarLogClub = document.getElementById('iniciar-sesion-club')

    let formularioBorrado = document.getElementById('borrar-usuario')

    formularioRegistro?.addEventListener('submit', datosSigIN)//La interrogacion vale para ver si existe el form 
    logInUsuario?.addEventListener('submit', datosLogIn)//si no no hace el eventListener
    formularioBorrado?.addEventListener('submit', borrarUsuario)
    
    formularioClub?.addEventListener('submit', datosSignClub)
    mostrarLogUsuario?.addEventListener('click', mostrarLogInUsuario)

    mostrarLogClub?.addEventListener('click', mostrarLogInClub)
    logInClub?.addEventListener('submit', datosLogInClub)

    botonLogIn?.addEventListener('click', mostrarLogIn)
    botonSignIn?.addEventListener('click', mostrarSignIn)
    
    leerUsuariosBD()
    leerClubsBD()
    comprobarSession()
    console.log('Todo cargado')
}
function mostrarLogIn(){
    document.getElementById('contenedor-log-in')?.classList.remove('hidden')
    document.getElementById('contenedor-sign-in')?.classList.add('hidden')
}
function mostrarSignIn(){
    document.getElementById('contenedor-sign-in')?.classList.remove('hidden')
    document.getElementById('contenedor-log-in')?.classList.add('hidden')
}
function mostrarLogInClub(){
    document.getElementById('log-in-club')?.classList.remove('hidden')
    document.getElementById('log-in-usuario')?.classList.add('hidden')
}
function mostrarLogInUsuario(){
    document.getElementById('log-in-usuario')?.classList.remove('hidden')
    document.getElementById('log-in-club')?.classList.add('hidden')
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
    let apellidos = /** @type {HTMLInputElement} */(document.getElementById('apellidos'))?.value
    let telefono = /** @type {HTMLInputElement} */(document.getElementById('n-telefono'))?.value
    let codClub = /** @type {HTMLInputElement} */(document.getElementById('cod-club'))?.value
    let password = /** @type {HTMLInputElement} */(document.getElementById('password-usuario'))?.value
    crearUsuario(name,email,apellidos,telefono,password,codClub)
    
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

    let loginUser =new User('', '', email,'','','',password)
    
    logIn(loginUser)//ojo al orden en el qe enviamos los parametros 
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
 * Creates a new User instance and adds it to the USER_DB array.
 * This function takes a user's name and email, constructs a User
 * object, and stores it in the user database. It then calls the
 * registrarUsuario function to save the updated database to local storage.
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} apellidos - El apellidos del usuario
 * @param {string} telefono - El telefono del usuario
 * @param {string} codClub - El codigo del club
 * @param {*} password - La contraseña
 */
async function crearUsuario(name,email,apellidos,telefono,password,codClub){
    let nuevoUsuario = new User('', name, email,apellidos,telefono,codClub,password)
    if(store.user.getAll().findIndex((/** @type {{ email: string; }} */ user) => user.email === email) >= 0 || email === ''){
        console.log('error registro email')
        document.getElementById('error-registro1')?.classList.remove('hidden')//estilos
        setTimeout(() => {
            document.getElementById('error-registro1')?.classList.add('hidden')
        }, 5000)
        return

    }

    if(store.club.getAll().findIndex((/** @type {{ codigo: string; }} */ club) => club.codigo === codClub) < 0){
        console.log('error registro codigo')
        document.getElementById('error-registro2')?.classList.remove('hidden')//estilos
        setTimeout(() => {
            document.getElementById('error-registro2')?.classList.add('hidden')
        }, 5000)
        return
    }
    // ESTAMOS AQUI EXPLORANDO METER EXPRESS Y ESCRIBIR EL USUARIO EN EL JSON LO HACE YA EL EXPRESS 
    //store.user.create(nuevoUsuario)
    // EL CODIGO QUE SIGUE DEBERIA IR EN ACTUALIZARLOCALSTORAGE PORQUE ESTAMOS ESCRIBIENDO EN LA "NUEVA BD" Y LA PARTE DE ARRIBA HABRIA QUE COMPROBAR SI LOS DATOS ESTAN EN ESE JSON ANTES DE ESCRIBIR NADA
    const payload = JSON.stringify(nuevoUsuario)

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/users`, 'POST', payload)
    if (!apiData) {
        //estilos
        document.getElementById('registrado')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('registrado')?.classList.add('hidden')
            location.href = '/index.html'
        }, 2000)
    }
    console.log('Respuesta del servidor de APIs', apiData)

    actualizarLocalStorageUsuarios()

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
function crearClub(nombre,siglas,codigoPostal,telClub,emailClub,password){
    let nuevoClub = new Club('',nombre,siglas,codigoPostal,telClub,emailClub, siglas + store.club.getAll().length,password)
    if(store.club.getAll().findIndex((/** @type {{ email: string; }} */ club) => club.email === emailClub) >= 0){
        document.getElementById('error-registro-club')?.classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('error-registro-club')?.classList.add('hidden')
        }, 1000)
        return
    }
    document.getElementById('registrado-club')?.classList.remove('hidden')
    
    store.club.create(nuevoClub)

    actualizarLocalStorageClubs()    
    
    setTimeout(() => {
        document.getElementById('registrado-club')?.classList.add('hidden')
        location.href = '/index.html'
    }, 2000)
}
/**
 * Saves the current state of the USER_DB array to local storage.
 * 
 * This function serializes the USER_DB array into a JSON string
 * and stores it in local storage under the key 'USER_DB'.
 * This allows the user database to be persisted across sessions.
 */
export function actualizarLocalStorageUsuarios(){
    //localStorage.setItem('USER_DB', JSON.stringify(store.user.getAll()))
    let listaUsuarios = JSON.parse(localStorage.getItem('REDUX_DB') || '')

    listaUsuarios.users = [...store.user.getAll()]

    localStorage.setItem('REDUX_DB', JSON.stringify(listaUsuarios))

    
}
/**
 * Saves the current state of the CLUB_DB array to local storage.
 * 
 * This function serializes the CLUB_DB array into a JSON string
 * and stores it in local storage under the key 'CLUB_DB'.
 * This allows the club database to be persisted across sessions.
 */
function actualizarLocalStorageClubs(){
    //localStorage.setItem('CLUB_DB',JSON.stringify(store.club.getAll()))
    let listaClubs = JSON.parse(localStorage.getItem('REDUX_DB') || '')

    listaClubs.clubs = [...store.club.getAll()]

    localStorage.setItem('REDUX_DB', JSON.stringify(listaClubs))
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
        actualizarLocalStorageUsuarios()
        sessionStorage.removeItem('user')
        location.href = '/index.html'
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

    const apiData = JSON.parse(await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/login`, 'POST', payload))
    
    if(apiData.length >= 0){
        console.log('Usuario logeado : ' + apiData[0].name)
        sessionStorage.setItem('HOOP MANAGER', apiData[0]._id)
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

async function logInClub(loginClub){
    const payload = JSON.stringify(loginClub)

    const apiData = JSON.parse(await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/loginClub`, 'POST', payload))

    if(apiData.length >=0){
        console.log('Club logeado : ' + apiData[0].nombre)
        sessionStorage.setItem('HOOP MANAGER CLUB', apiData[0]._id)
    }
}
/**
 * Reads the user and club databases from local storage and populates
 * the corresponding SingletonDB instances with the data.
 *
 * This function checks local storage for 'USER_DB' and 'CLUB_DB' keys.
 * If they exist, it parses the JSON strings into User and Club objects,
 * respectively, and adds them to the SingletonDB instances USER_DB and CLUB_DB.
 * If the databases are not already initialized, it logs a message indicating
 * their initialization. This ensures that the user and club data are
 * available in memory for further operations.
 */
export function leerUsuariosBD(){
    /**
     * @type {User[]}
     */
    let usersAlmacenadosDB = []
    if(localStorage.getItem('REDUX_DB')){
        let usersDB = localStorage.getItem('REDUX_DB')

        if(usersDB === null){
            // Asignamos una cadena de texto vacía, para no romper JSON.parse()
            usersDB = ''
        }
        usersAlmacenadosDB = JSON.parse(usersDB).users
    }else{
        localStorage.setItem('REDUX_DB', JSON.stringify(INITIAL_STATE))
    }

    usersAlmacenadosDB.forEach(( /** @type {User} */newUser) => {
        store.user.create(newUser)
    });
    
}
/**
 * Reads the club database from local storage and populates the store
 * with the data.
 *
 * This function checks local storage for the 'REDUX_DB' key. If it exists,
 * it parses the JSON string to extract the array of Club objects and adds them
 * to the store. If the key does not exist, it initializes it with the default
 * state. This ensures that the club data is available in memory for further
 * operations.
 */
export function leerClubsBD(){
    /**
     * @type {Club[]}
     */
    let clubsAlmacenadosDB = []
    if(localStorage.getItem('REDUX_DB')){
        let clubsDB = localStorage.getItem('REDUX_DB')
        if(clubsDB === null){
            // Asignamos una cadena de texto vacía, para no romper JSON.parse()
            clubsDB = ''
        }
        clubsAlmacenadosDB = JSON.parse(clubsDB).clubs
    }else{
        localStorage.setItem('REDUX_DB', JSON.stringify(INITIAL_STATE))

    }

    clubsAlmacenadosDB.forEach(( /** @type {Club} */newClub) => {
        store.club.create(newClub)
    });

}





/**
 * Retrieves the shopping list data from session storage.
 *
 * @returns {import('./store/redux.js').State} Saved state.
 * If no data is found, returns an empty State object.
 */
function getDataFromSessionStorage() {
    const defaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(sessionStorage.getItem('REDUX_DB') || defaultValue)
  }
/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {any} [data]
 * @returns {Promise<Array<User>>}
 */
export async function getAPIData(apiURL, method = 'GET', data) {
    let apiData
  
    try {
      let headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }
      // Añadimos la cabecera Authorization si el usuario esta logueado
      if (isUserLoggedIn()) {
        const userData = getDataFromSessionStorage()
        headers.append('Authorization', `Bearer ${userData?.user?.token}`)
      }
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(TIMEOUT),
        method: method,
        body: data ?? undefined,
        headers: headers
      });
    } catch (/** @type {any | HttpError} */err) {
      // En caso de error, controlamos según el tipo de error
      if (err.name === 'AbortError') {
        console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          console.error('Not found');
        }
        if (err.response.status === 500) {
          console.error('Internal server error');
        }
      }
    }
  
    return apiData
  }
/**
 * Checks if there is a user logged in by verifying the presence of a token
 * in the local storage.
 *
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
function isUserLoggedIn() {
    const userData = getDataFromSessionStorage()
    return userData?.user?.token
}

