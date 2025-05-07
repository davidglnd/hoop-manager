//@ts-expect-error //TO DO arreglar y trabajar en el main
 
import { Jugador } from "./classes/Jugador.js";
import { getAPIData } from './utils.js'
import { calculoCategoria } from './utils.js'
import {mostrarEquipos} from './logic/equipos.js'
import {mostrarCalendario} from './logic/calendario.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)

const API_PORT = location.port ? `:${1337}` : ''
/**
 * When the page has finished loading, it does the following:
 * 1. Gets the logged in user from session storage.
 * 2. Gets the user from the store with the id of the logged in user.
 * 3. Adds an event listener to the form for adding a player to the user's team so that when the form is submitted, the datosJugador function is called with the event and the user.
 * 4. Calls the leerListaJugadores, mostrarInformacionUsuario, and mostrarHerramientasGestion functions with the user as an argument.
 * 5. Calls the importarJugadores function (but this is commented out for now).
 */
function onDOMContentLoaded(){
    let usuarioLogeado = JSON.parse(sessionStorage.getItem('HOOP_MANAGER') ?? '')
    
    let añadirJugadores = document.getElementById('añadir-jugador-form')

    añadirJugadores?.addEventListener('submit', (e) => datosJugador (e,usuarioLogeado) )
    
    let selectLit = document.getElementById('comp-select-lit')

    selectLit?.addEventListener('equipo-cambiado', (e) => useSelect (e))

    mostrarPerfil(usuarioLogeado)
    mostrarHerramientasGestion(usuarioLogeado)
}
/**
 * Takes the data from the form and creates a new Jugador object with that data.
 * It then adds that Jugador to the array of jugadores of the usuarioBD.
 * @param {Event} event - the event that triggered this function.
 * @param {{ _id: string; clubAsoc: string; }} usuarioBD - The user object that is adding the Jugador.
 */
function datosJugador(event,usuarioLogeado){
    event.preventDefault()

    let inputNombre = /** @type {HTMLInputElement} */(document.getElementById('jugador-nombre')).value
    let inputApellidos = /** @type {HTMLInputElement} */(document.getElementById('jugador-apellidos')).value
    let inputFnac = /** @type {HTMLInputElement} */(document.getElementById('jugador-fnac')).value
    let inputSexo = /** @type {HTMLInputElement} */(document.getElementById('jugador-sexo')).value
    let inputDireccion = /** @type {HTMLInputElement} */(document.getElementById('jugador-direccion')).value
    
    let categoriaCalculada = calculoCategoria(inputFnac)

    addJugador(inputNombre,inputApellidos,inputFnac,inputSexo,inputDireccion,usuarioLogeado,categoriaCalculada)
}
/**
 * Displays the user's profile information on the webpage.
 * This function creates and appends paragraphs containing the 
 * user's name, email, and phone number to the 'informacion-usuario' 
 * element on the page. It formats the user's name and surname with 
 * an initial capital letter.
 * 
 * @param {Object} usuario - The user object containing user information.
 * @param {string} usuario._id - The user's id.
 * @param {string} usuario.name - The user's first name.
 * @param {string} usuario.apellidos - The user's surname.
 * @param {string} usuario.email - The user's email address.
 * @param {string} usuario.telefono - The user's phone number.
 * @param {string} usuario.rol - The user's phone number.
 */

function mostrarPerfil(usuario){

    let contenedorInformacion = document.getElementById('informacion-usuario')

    let informacionH1 = document.createElement('h1')
    informacionH1.innerText = 'Información de perfil'
    contenedorInformacion?.appendChild(informacionH1)

    let nombreApellidos = document.createElement('p')
    nombreApellidos.innerText = 'Bienvenido a tu perfil: ' + mayusculasInicial(usuario.nombre) + ' ' + mayusculasInicial(usuario.apellidos)
    contenedorInformacion?.appendChild(nombreApellidos)

    let email = document.createElement('p')
    email.innerText = 'Email: ' + usuario.email
    contenedorInformacion?.appendChild(email)

    let telefono = document.createElement('p')
    telefono.innerText = 'Telefono: ' + usuario.telefono
    contenedorInformacion?.appendChild(telefono)

    let rol = document.createElement('p')
    rol.innerText = 'Rol: ' + usuario.rol
    contenedorInformacion?.appendChild(rol)

    let editarPerfil = document.createElement('button')
    editarPerfil.innerText = 'Editar perfil'
    editarPerfil.classList = 'button'
    editarPerfil.addEventListener('click', () => modificarPerfil(usuario))
    contenedorInformacion?.appendChild(editarPerfil)

}

/**
 * Shows a form to modify the user's profile information. This function
 * creates the form elements and appends them to the 'informacion-usuario'
 * element on the page. It also adds an event listener to the form to
 * capture the 'submit' event and call the 'guardarCambiosPerfil' function
 * with the user's id and the event as arguments.
 * @param {Object} usuario - The user object containing user information.
 * @param {string} usuario._id - The user's id.
 * @param {string} usuario.name - The user's first name.
 * @param {string} usuario.apellidos - The user's surname.
 * @param {string} usuario.email - The user's email address.
 * @param {string} usuario.telefono - The user's phone number.
 */
function modificarPerfil(usuario){

    const INFORMACION_USUARIO = document.getElementById('informacion-usuario');
    if (INFORMACION_USUARIO) {
        borradoContenedoresPerfil(INFORMACION_USUARIO);
    }

    let formulario = document.createElement('form')
    formulario.id = 'modificar-perfil'
    INFORMACION_USUARIO?.appendChild(formulario)

    let name = document.createElement('input')
    name.type = 'text'
    name.id = 'name'
    name.value = usuario?.nombre
    formulario.appendChild(name)

    let apellidos = document.createElement('input')
    apellidos.type = 'text'
    apellidos.id = 'apellidos'
    apellidos.value = usuario.apellidos
    formulario.appendChild(apellidos)

    let email = document.createElement('input')
    email.type = 'email'
    email.id = 'email'
    email.value = usuario.email
    formulario.appendChild(email)

    let telefono = document.createElement('input')
    telefono.type = 'text'
    telefono.id = 'telefono'
    telefono.value = usuario.telefono
    formulario.appendChild(telefono)

    let guardarCambios = document.createElement('button')
    guardarCambios.innerText = 'Guardar cambios'
    guardarCambios.classList = 'button'
    formulario.appendChild(guardarCambios)
    formulario.addEventListener('submit',(event) => guardarCambiosPerfil(event,usuario))
}

/**
 * Modifies the user's profile information in the store and local storage.
 * It takes the data from the form and creates a new User object with that data.
 * It then updates the User object in the store with the new data.
 * @param {Event} event - the event that triggered this function.
 * @param {Object} usuario - The user object containing user information.
 * @param {string} usuario._id - The user's id.
 * @param {string} usuario.name - The user's first name.
 * @param {string} usuario.apellidos - The user's surname.
 * @param {string} usuario.email - The user's email address.
 * @param {string} usuario.telefono - The user's phone number.
 */
async function guardarCambiosPerfil(event,usuario){
    event.preventDefault()
    let name = /** @type {HTMLInputElement} */(document.getElementById('name'))?.value
    let apellidos = /** @type {HTMLInputElement} */(document.getElementById('apellidos'))?.value
    let email = /** @type {HTMLInputElement} */(document.getElementById('email'))?.value
    let telefono = /** @type {HTMLInputElement} */(document.getElementById('telefono'))?.value

    let usuarioModificado = {
        ...usuario,
        nombre: name,
        apellidos:apellidos,
        email: email,
        telefono: telefono,
    }
    const payload = {
        nombre: name,
        apellidos:apellidos,
        email: email,
        telefono: telefono,
    }
    
    if(usuario.nombre === name && usuario.apellidos === apellidos && usuario.email === email && usuario.telefono === telefono){
        console.log('No hay cambios')
        borradoContenedoresPerfil(document.getElementById('informacion-usuario'))
        mostrarPerfil(usuario)
    }else{
        await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/user/${usuario._id}`, 'PUT', JSON.stringify(payload))
        sessionStorage.setItem('HOOP_MANAGER',JSON.stringify(usuarioModificado))
        borradoContenedoresPerfil(document.getElementById('informacion-usuario'))
        mostrarPerfil(usuarioModificado)
        
    }
    
    
}
/**
 * Adds a new Jugador to the store and to local storage.
 * @param {string} inputNombre - The name of the new Jugador.
 * @param {string} inputApellidos - The surname of the new Jugador.
 * @param {string} inputFnac - The date of birth of the new Jugador.
 * @param {string} inputSexo - The gender of the new Jugador.
 * @param {string} inputDireccion - The address of the new Jugador.
 * @param {Object} usuarioBD - The user object that is adding the Jugador.
 * @param {string} usuarioBD._id - The id of the user.
 * @param {string} usuarioBD.clubAsoc - The club associated with the user.
 * @param {string} categoriaCalculada - The category of the new Jugador.
 */
function addJugador(inputNombre,inputApellidos,inputFnac,inputSexo,inputDireccion,usuarioBD,categoriaCalculada){
    let nuevoJugador = new Jugador('',usuarioBD._id,inputNombre,inputApellidos,inputFnac,inputSexo,inputDireccion,usuarioBD.clubAsoc,'',categoriaCalculada)
    console.log(nuevoJugador)
    // TO DO VAMOS POR AQUI AÑADIENDO EL JUGADOR A LA BBDD
}
/**
 * Removes all child elements from the specified container element.
 *
 * @param {HTMLElement} contenedor - The container element from which all child elements will be removed.
 */

function borradoContenedoresPerfil(contenedor){ // TO DO utils.js

    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild)
    }

}
/**
 * Converts the first letter of a string to uppercase and the rest to lowercase.
 * @param {string} text - The string to be formatted.
 * @returns {string} The formatted string.
 */
function mayusculasInicial(text) { // TO DO utils.js
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}
/**
 * If the user is an entrenador, this function adds a menu item to the navigation menu
 * to allow them to use others functions.
 * @param {Object} usuarioBD - The user object from the database.
 * @param {string} usuarioBD.rol - The role of the user.
 */
function mostrarHerramientasGestion(usuarioBD){

    if (usuarioBD.rol === 'entrenador') {
        /*CREA ENTRENAMIENTOS*/
        const MENU_NAVEGACION = document.getElementById('menu-club');
        
        const LI_CERRAR_SESION = document.getElementById('cerrar-sesion');

        let liCrearEntrenamientos = document.createElement('li')

        MENU_NAVEGACION?.insertBefore(liCrearEntrenamientos, LI_CERRAR_SESION )

        let aCrearEntrenamientos = document.createElement('a')
        aCrearEntrenamientos.innerText = 'Crear entrenamientos'
        aCrearEntrenamientos.href = 'crear-entrenamientos.html'

        liCrearEntrenamientos.appendChild(aCrearEntrenamientos)
        
        // /*CREA CALENDARIO POR EQUIPOS */ 
    }
    if (usuarioBD.rol === 'familiar') {
        const MENU_NAVEGACION = document.getElementById('menu-club');
        
        const LI_CERRAR_SESION = document.getElementById('cerrar-sesion');

        let liCrearEntrenamientos = document.createElement('li')

        MENU_NAVEGACION?.insertBefore(liCrearEntrenamientos, LI_CERRAR_SESION )

        let aCrearEntrenamientos = document.createElement('a')
        aCrearEntrenamientos.innerText = 'Añadir jugadores'
        aCrearEntrenamientos.href = 'añadir-jugadores.html'
        liCrearEntrenamientos.appendChild(aCrearEntrenamientos)
    }
}
function useSelect(e){
    if(location.pathname ==='/calendario.html'){
        mostrarCalendario(e)
    }
    if(location.pathname ==='/equipos.html'){
        mostrarEquipos(e)
    }
}






















