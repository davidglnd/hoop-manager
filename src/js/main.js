//@ts-check
import { cerrarSesion } from "./gestion-usuarios-script.js";
import { registrarUsuario } from "./gestion-usuarios-script.js";
import { store } from './store/redux.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)

function onDOMContentLoaded(){
    let ususarioLogeado = JSON.parse(sessionStorage.getItem('user') ?? '')
    let usuarioBD = store.user.getById(ususarioLogeado._id)

    mostrarInformacionUsuario(usuarioBD)
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
 * @param {string} usuario.nTelefono - The user's phone number.
 */

function mostrarInformacionUsuario(usuario){
    let contenedorInformacion = document.getElementById('informacion-usuario')

    let nombreApellidos = document.createElement('p')
    nombreApellidos.innerText = 'Bienvenido a tu perfil: ' + mayusculasInicial(usuario.name) + ' ' + mayusculasInicial(usuario.apellidos)
    contenedorInformacion?.appendChild(nombreApellidos)

    let email = document.createElement('p')
    email.innerText = 'Email: ' + usuario.email
    contenedorInformacion?.appendChild(email)

    let telefono = document.createElement('p')
    telefono.innerText = 'Telefono: ' + usuario.nTelefono
    contenedorInformacion?.appendChild(telefono)

    let editarPerfil = document.createElement('button')
    editarPerfil.innerText = 'Editar perfil'
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
 * @param {string} usuario.nTelefono - The user's phone number.
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
    name.value = usuario?.name
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
    telefono.value = usuario.nTelefono
    formulario.appendChild(telefono)

    let guardarCambios = document.createElement('button')
    guardarCambios.innerText = 'Guardar cambios'
    formulario.appendChild(guardarCambios)
    formulario.addEventListener('submit',(event) => guardarCambiosPerfil(event,usuario._id))
}
/**
 * This function takes the new user information from the form and
 * updates the user object in the store. It then calls the
 * registrarUsuario function to save the updated user to local
 * storage, and the onDOMContentLoaded function to update the
 * user profile information on the page.
 * @param {Event} event - The event that triggered this function.
 * @param {string} usuario - The id of the user to be updated.
 */
function guardarCambiosPerfil(event,usuario){
    event.preventDefault()
    
    let name = /** @type {HTMLInputElement} */(document.getElementById('name'))?.value
    let apellidos = /** @type {HTMLInputElement} */(document.getElementById('apellidos'))?.value
    let email = /** @type {HTMLInputElement} */(document.getElementById('email'))?.value
    let telefono = /** @type {HTMLInputElement} */(document.getElementById('telefono'))?.value

    let usuarioCambiar = store.user.getById(usuario)
    
    let usuarioModificado = {
        ...usuarioCambiar,
        name: name,
        apellidos:apellidos,
        email: email,
        nTelefono: telefono
    }

    store.user.update(usuarioModificado)   
   
    const INFORMACION_USUARIO = document.getElementById('informacion-usuario');
    if (INFORMACION_USUARIO) {
        borradoContenedoresPerfil(INFORMACION_USUARIO);
    }
    registrarUsuario()

    onDOMContentLoaded()

    
}
/*TO DO funciones exportables a utils.js*/

/**
 * Removes all child elements from the specified container element.
 *
 * @param {HTMLElement} contenedor - The container element from which all child elements will be removed.
 */

function borradoContenedoresPerfil(contenedor){

    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild)
    }

}
/**
 * Converts the first letter of a string to uppercase and the rest to lowercase.
 * @param {string} text - The string to be formatted.
 * @returns {string} The formatted string.
 */
function mayusculasInicial(text) {
    console.log(text)
    const PRIMERA_LETRA = text.charAt(0);
    return PRIMERA_LETRA.toUpperCase() + text.slice(1).toLowerCase();
  }