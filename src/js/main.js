//@ts-check
import { registrarUsuario } from "./gestion-usuarios-script.js";
import { INITIAL_STATE ,store } from './store/redux.js'
import { Jugador } from "./classes/Jugador.js";
//import jugador from '../api/jugadores_CBA0.json' with { type: "json" }
//TO DO LOS FALLOS DE TS SON PORQUE FALTA VERIFICACIONES PARA VER QUE NO ES NULL EN ALGUN MOMENTO EN ADD JUGADOR ESTA ARREGLADO
// TO DO, SEPARAR FUNCIONES DE ADDJUGADOR Y LA DE INCLUIR EN LOCALSTORAGE EL JUFGADOR
window.addEventListener("DOMContentLoaded", onDOMContentLoaded)
/**
 * When the page has finished loading, it does the following:
 * 1. Gets the logged in user from session storage.
 * 2. Gets the user from the store with the id of the logged in user.
 * 3. Adds an event listener to the form for adding a player to the user's team so that when the form is submitted, the datosJugador function is called with the event and the user.
 * 4. Calls the leerListaJugadores, mostrarInformacionUsuario, and mostrarHerramientasGestion functions with the user as an argument.
 * 5. Calls the importarJugadores function (but this is commented out for now).
 */
function onDOMContentLoaded(){
    let usuarioLogeado = JSON.parse(sessionStorage.getItem('user') ?? '')
    
    let usuarioBD = store?.user?.getById?.(usuarioLogeado._id);

    let añadirJugadores = document.getElementById('añadir-jugador-form')

    añadirJugadores?.addEventListener('submit', (e) => datosJugador (e,usuarioBD) )

    leerListaJugadores()
    mostrarInformacionUsuario(usuarioBD)
    mostrarHerramientasGestion(usuarioBD)
    //importarJugadores()
}

/**
 * Takes the data from the form and creates a new Jugador object with that data.
 * It then adds that Jugador to the array of jugadores of the usuarioBD.
 * @param {Event} event - the event that triggered this function.
 * @param {{ _id: string; clubAsoc: string; }} usuarioBD - The user object that is adding the Jugador.
 */
function datosJugador(event,usuarioBD){
    event.preventDefault()
    console.log(usuarioBD)
    let inputNombre = /** @type {HTMLInputElement} */(document.getElementById('jugador-nombre')).value
    let inputApellidos = /** @type {HTMLInputElement} */(document.getElementById('jugador-apellidos')).value
    let inputFnac = /** @type {HTMLInputElement} */(document.getElementById('jugador-fnac')).value
    let inputSexo = /** @type {HTMLInputElement} */(document.getElementById('jugador-sexo')).value
    let inputDireccion = /** @type {HTMLInputElement} */(document.getElementById('jugador-direccion')).value
    
    addJugador(inputNombre,inputApellidos,inputFnac,inputSexo,inputDireccion,usuarioBD)
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
 * @param {string} usuario.rol - The user's phone number.
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

    let rol = document.createElement('p')
    rol.innerText = 'Rol: ' + usuario.rol
    contenedorInformacion?.appendChild(rol)

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

    let usuarioCambiar = store?.user?.getById?.(usuario)
    
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
 */
function addJugador(inputNombre,inputApellidos,inputFnac,inputSexo,inputDireccion,usuarioBD){
    let nuevoJugador = new Jugador('',usuarioBD._id,inputNombre,inputApellidos,inputFnac,inputSexo,inputDireccion,usuarioBD.clubAsoc)

    store.jugador.create(nuevoJugador)

    let listaJugadores = JSON.parse(localStorage.getItem('REDUX_DB') || '')

    listaJugadores.jugadores = [...store.jugador.getAll()]

    localStorage.setItem('REDUX_DB', JSON.stringify(listaJugadores))
}

/*TO DO funciones exportables a utils.js*/
function leerListaJugadores(){
    let listaJugadores = []

    if(localStorage.getItem('REDUX_DB')){
        let listaJugadoresBD = localStorage.getItem('REDUX_DB')

        if(listaJugadoresBD === null){
            // Asignamos una cadena de texto vacía, para no romper JSON.parse()
            listaJugadoresBD = ''
        }
        listaJugadores = JSON.parse(listaJugadoresBD).jugadores
    }else{
        localStorage.setItem('REDUX_DB', JSON.stringify(INITIAL_STATE))
    }
    listaJugadores.forEach(( /** @type {Jugador} */newJugador) => {
        store.jugador.create(newJugador)
    })
    console.log(store.jugador.getAll())
}
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
/**
 * If the user is an entrenador, this function adds a menu item to the navigation menu
 * to allow them to use others functions.
 * @param {Object} usuarioBD - The user object from the database.
 * @param {string} usuarioBD.rol - The role of the user.
 */
function mostrarHerramientasGestion(usuarioBD){
    console.log(usuarioBD.rol)
    if (usuarioBD.rol === 'entrenador') {
        const MENU_NAVEGACION = document.getElementById('menu-club');
        
        const LI_CERRAR_SESION = document.getElementById('cerrar-sesion');

        let liCrearEntrenamientos = document.createElement('li')

        MENU_NAVEGACION?.insertBefore(liCrearEntrenamientos, LI_CERRAR_SESION )

        let aCrearEntrenamientos = document.createElement('a')
        aCrearEntrenamientos.innerText = 'Crear entrenamientos'
        aCrearEntrenamientos.href = 'crear-entrenamientos.html'

        liCrearEntrenamientos.appendChild(aCrearEntrenamientos)
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




/* IMPORTACION JUGADORES DE PRUEBA */

// function importarJugadores(){
//  console.log(jugador)
//  jugador.forEach(jugador => {
//     addJugador(jugador.nombre,jugador.apellidos,jugador.fnac,jugador.sexo,jugador.direccion,jugador._id_familiar)
//  });
// }