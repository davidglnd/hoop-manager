//@ts-check
 
import { getAPIData, borradoContenedoresPerfil, API_PORT, mayusculasInicial } from './utils.js'
import {mostrarEquipos, cardMatchSubmit} from './logic/equipos.js'
import {datosJugadores} from './logic/addJugadores.js'
import {mostrarCalendario} from './logic/calendario.js'
import { menu, mostrarUsuariosAdmin } from './admin/admin-usuarios.js'
import { menuAdminClub } from './admin/admin-club.js'
import { menuAdminEquipo, mostrarEquiposAdmin, crearEquipo} from './admin/admin-equipos.js'


window.addEventListener("DOMContentLoaded", onDOMContentLoaded)


/**
 * Function executed when the DOM content is fully loaded.
 * Initializes event listeners and displays user-specific content.
 * 
 * - Retrieves the logged-in user's information from session storage.
 * - Adds a submit event listener to the 'añadir-jugador-form' to handle player data submission.
 * - Listens for custom events 'equipo-cambiado' and 'convocatoria-creada' to trigger respective handlers.
 * - Displays the user's profile and management tools.
 * - If on the '/equipos.html' page and the user role is 'entrenador', dynamically adds navigation tools for the coach.
 * 
 */

async function onDOMContentLoaded(){
    let usuarioLogeado = JSON.parse(sessionStorage.getItem('HOOP_MANAGER') ?? '')
    
    if(usuarioLogeado.rol === 'ADMIN' && location.pathname === '/admin/admin-usuarios.html'){
        const USUARIOS = await menu(usuarioLogeado)
        // @ts-expect-error Arreglar estos errores
        document.addEventListener('filter-bar-clicked', (e) => mostrarUsuariosAdmin(e,USUARIOS))
        return
    }

    if(usuarioLogeado.rol === 'ADMIN' && location.pathname === '/admin/admin-club.html'){
        menuAdminClub()
        return
    }

    if(usuarioLogeado.rol === 'ADMIN' && location.pathname === '/admin/admin-equipos.html'){
        //Llamamos una primera funcion que trae los equipos para que cuando hagamos el custom
        //event tengamos solo que filtrar esos equipos, es decir ya estan leidos los equipos de ese club
        const EQUIPOS = await menuAdminEquipo(usuarioLogeado)
        //custom event que se dispara desde el SHADOWDOM 
        document.addEventListener('filter-bar-clicked', (e) => mostrarEquiposAdmin (e,EQUIPOS))
        //custom event que se dispara desde el SHADOWDOM, que usamos porque en el parametro de 
        //la funcion menuAdminEquipo pasamos el parametro boton como true
        document.addEventListener('boton-lit-admin-filter-bar', (e) => crearEquipo(e,usuarioLogeado))
        return
    }

    //custom event que se dispara desde el SHADOWDOM 
    document.addEventListener('equipo-cambiado', (e) => useSelect (e))

    //custom event que se dispara desde el SHADOWDOM 
    // @ts-expect-error TO DO ARREGLAR ESTO
    document.addEventListener('convocatoria-creada', (e) => cardMatchSubmit(e))

    //evento del submit añadir jugadores
    document.getElementById('add-jugadores-form')?.addEventListener('submit', (e) => datosJugadores(e))

    mostrarPerfil(usuarioLogeado)
    mostrarHerramientasGestion(usuarioLogeado)

    if(location.pathname === '/equipos.html'){ 
        mostrarNav(usuarioLogeado)
    }
}



/**
 * Displays the user's profile information in the 'informacion-usuario' container.
 * Creates HTML elements to show the user's name, email, phone number, and role.
 * Also adds a button to edit the profile, which triggers the modify profile function.
 *
 * @param {Object} usuario - The user object containing profile information.
 * @param {string} usuario.nombre - The user's first name.
 * @param {string} usuario.apellidos - The user's surname.
 * @param {string} usuario.email - The user's email address.
 * @param {string} usuario.telefono - The user's phone number.
 * @param {string} [usuario.rol] - The user's role.
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
 * Transforms the user's profile display into an editable form for updating the profile information.
 * Clears the existing user information from the display and creates a form with pre-filled values 
 * from the user's current profile. Adds a submit button to save changes, which triggers the 
 * `guardarCambiosPerfil` function upon submission.
 * 
 * @param {Object} usuario - The user object containing the current profile information.
 * @param {string} usuario.nombre - The user's first name.
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
 * Handles the submission of the user's profile edit form.
 * Checks if any changes have been made before making a request to update the user's profile.
 * If no changes have been made, it will not make the request and will just refresh the display.
 * Otherwise, it will make the request and update the session storage with the new values.
 * It then calls the `mostrarPerfil` function to refresh the display with the updated information.
 * 
 * @param {Event} event - the event that triggered this function.
 * @param {Object} usuario - The user object containing the current profile information.
 * @param {string} usuario.nombre - The user's first name.
 * @param {string} usuario.apellidos - The user's surname.
 * @param {string} usuario.email - The user's email address.
 * @param {string} usuario.telefono - The user's phone number.
 * @param {string} [usuario._id] - The user's id.
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

        const informacionUsuario = document.getElementById('informacion-usuario');

        if (informacionUsuario) {
            borradoContenedoresPerfil(informacionUsuario);
            mostrarPerfil(usuario);
        } else {
            console.error('Element with id "informacion-usuario" not found');
        }
    }else{
        await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/user/${usuario._id}`, 'PUT', JSON.stringify(payload))
        sessionStorage.setItem('HOOP_MANAGER',JSON.stringify(usuarioModificado))

        const informacionUsuario = document.getElementById('informacion-usuario');

        if (informacionUsuario) {
            borradoContenedoresPerfil(informacionUsuario);
            mostrarPerfil(usuarioModificado);
        } else {
            console.error('Element with id "informacion-usuario" not found');
        }
    }
    
    
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

/**
 * Depending on the current location, this function calls either `mostrarCalendario`
 * or `mostrarEquipos` with the given event object `e` as an argument.
 * @param {Event} e - The event object from the listener.
 */
function useSelect(e){
    if(location.pathname ==='/calendario.html'){
        // @ts-expect-error TO DO ARREGLAR
        mostrarCalendario(e)
    }
    if(location.pathname ==='/equipos.html'){
       // @ts-expect-error TO DO ARREGLAR
        mostrarEquipos(e)
    }
}

/**
 * Depending on the user's role, this function adds a navigation menu item 
 * to the 'main-entrenador' element to allow them to use others functions.
 * If the user is an entrenador, it adds two menu items 'Añadir jugadores' and
 * 'Añadir convocatoria'.
 * @param {Object} usuarioLogeado - The user object from the database.
 * @param {string} usuarioLogeado.rol - The role of the user.
 */
function mostrarNav(usuarioLogeado){
    const MAIN_ENTRENADOR = document.getElementById('main-entrenador')
    if(usuarioLogeado.rol === 'entrenador'){
        const NAV_HERRAMIENTAS = document.createElement('nav')
        NAV_HERRAMIENTAS.id = 'nav-entrenador'
        MAIN_ENTRENADOR?.appendChild(NAV_HERRAMIENTAS)

        const OL_HERRAMIENTAS = document.createElement('ol')
        NAV_HERRAMIENTAS.appendChild(OL_HERRAMIENTAS)

        const LI_ADD_JUGADORES = document.createElement('li')
        LI_ADD_JUGADORES.id = 'add-jugadores'
        LI_ADD_JUGADORES.innerText = 'Añadir jugadores'
        OL_HERRAMIENTAS.appendChild(LI_ADD_JUGADORES)
        

        const LI_CONVOCATORIA = document.createElement('li')
        LI_CONVOCATORIA.id = 'convocatoria'
        LI_CONVOCATORIA.innerText = 'Añadir convocatoria'
        OL_HERRAMIENTAS.appendChild(LI_CONVOCATORIA)
    }

    if(usuarioLogeado.rol === 'familiar'){
        const NAV_HERRAMIENTAS = document.createElement('nav')
        NAV_HERRAMIENTAS.id = 'nav-entrenador'
        MAIN_ENTRENADOR?.appendChild(NAV_HERRAMIENTAS)

        const OL_HERRAMIENTAS = document.createElement('ol')
        NAV_HERRAMIENTAS.appendChild(OL_HERRAMIENTAS)

        const LI_CONVOCATORIA = document.createElement('li')
        LI_CONVOCATORIA.id = 'ver-convocatoria'
        LI_CONVOCATORIA.innerText = 'Convocatorias disponibles'
        OL_HERRAMIENTAS.appendChild(LI_CONVOCATORIA)
    }
}

















