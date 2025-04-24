//@ts-expect-error //TO DO arreglar y trabajar en el main
 
import { INITIAL_STATE ,store } from './store/redux.js'
import { Jugador } from "./classes/Jugador.js";
//import { getAPIData } from './utils.js';

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)

//const API_PORT = location.port ? `:${1337}` : ''
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

    let usuarioBD = store?.user?.getById?.(usuarioLogeado._id);

    let añadirJugadores = document.getElementById('añadir-jugador-form')

    añadirJugadores?.addEventListener('submit', (e) => datosJugador (e,usuarioBD) )

    leerListaJugadores()
    leerEquipos()
    mostrarInformacionUsuario(usuarioLogeado[0])
    mostrarHerramientasGestion(usuarioLogeado[0])
    mostrarEquipos(usuarioLogeado[0])
}
/**
 * Takes the data from the form and creates a new Jugador object with that data.
 * It then adds that Jugador to the array of jugadores of the usuarioBD.
 * @param {Event} event - the event that triggered this function.
 * @param {{ _id: string; clubAsoc: string; }} usuarioBD - The user object that is adding the Jugador.
 */
function datosJugador(event,usuarioBD){
    event.preventDefault()

    let inputNombre = /** @type {HTMLInputElement} */(document.getElementById('jugador-nombre')).value
    let inputApellidos = /** @type {HTMLInputElement} */(document.getElementById('jugador-apellidos')).value
    let inputFnac = /** @type {HTMLInputElement} */(document.getElementById('jugador-fnac')).value
    let inputSexo = /** @type {HTMLInputElement} */(document.getElementById('jugador-sexo')).value
    let inputDireccion = /** @type {HTMLInputElement} */(document.getElementById('jugador-direccion')).value
    
    let categoriaCalculada = calculoCategoria(inputFnac)

    addJugador(inputNombre,inputApellidos,inputFnac,inputSexo,inputDireccion,usuarioBD,categoriaCalculada)
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
 * @param {string} usuario.nTelefono - The user's phone number.
 */
async function guardarCambiosPerfil(event,usuario){
    event.preventDefault()
    console.log(usuario)
    let name = /** @type {HTMLInputElement} */(document.getElementById('name'))?.value
    let apellidos = /** @type {HTMLInputElement} */(document.getElementById('apellidos'))?.value
    let email = /** @type {HTMLInputElement} */(document.getElementById('email'))?.value
    let telefono = /** @type {HTMLInputElement} */(document.getElementById('telefono'))?.value

    //let usuarioCambiar = store?.user?.getById?.(usuario)
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let usuarioModificado = {
        ...usuario,
        name: name,
        apellidos:apellidos,
        email: email,
        nTelefono: telefono
    }

    //const payload = usuarioModificado

    //const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/user/${usuario._id}`, 'PUT', payload)
    //store.user.update(usuarioModificado)   
   
    // const INFORMACION_USUARIO = document.getElementById('informacion-usuario');
    // if (INFORMACION_USUARIO) {
    //     borradoContenedoresPerfil(INFORMACION_USUARIO);
    // }
    //actualizarLocalStorageUsuarios()

    //onDOMContentLoaded()

    
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
        if(listaJugadores){
            listaJugadores.forEach(( /** @type {Jugador} */newJugador) => {
                store.jugador.create(newJugador)
            })
        }
    }else{
        localStorage.setItem('REDUX_DB', JSON.stringify(INITIAL_STATE))
    }

}
/**
 * Reads the list of Equipos from local storage and updates the store
 * array with the read data.
 *
 * If no data is found in local storage, the global store is left unchanged.
 *
 * @returns {void}
 * @import { Equipo } from "./classes/Equipo.js"; 
 */
function leerEquipos(){
    let listaEquipos = []

    if(localStorage.getItem('REDUX_DB')){
        let listaEquiposBD = localStorage.getItem('REDUX_DB')

        if(listaEquiposBD === null){
            // Asignamos una cadena de texto vacía, para no romper JSON.parse()
            listaEquiposBD = ''
        }
        listaEquipos = JSON.parse(listaEquiposBD).equipos
        if(listaEquipos){
            listaEquipos.forEach(( /** @type {Equipo} */newEquipo) => {
                store.equipo.create(newEquipo)
            })
        }
    }else{
        localStorage.setItem('REDUX_DB', JSON.stringify(INITIAL_STATE))
    }
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
 * Calculate the category of a player based on their date of birth.
 * @param {string} fnac - The date of birth of the player in the format "yyyy-mm-dd"
 * @returns {string} The category of the player.
 */
export function calculoCategoria(fnac){ // TO DO LLevar a utils.js
    const TEMPORADA_ACTUAL = new Date().getFullYear()
    let stringSpliced = parseInt(fnac.slice(0,4))
    let edadTemporada = TEMPORADA_ACTUAL - stringSpliced
    if(edadTemporada === 7 || edadTemporada === 8 || edadTemporada === 9) return "BENJAMIN"
    if(edadTemporada === 10 || edadTemporada === 11) return "Alevin"
    if(edadTemporada === 12 || edadTemporada === 13) return "Infantil"
    if(edadTemporada === 14 || edadTemporada === 15) return "Cadete"
    if(edadTemporada === 16 || edadTemporada === 17) return "Juvenil"
    if(edadTemporada >= 18) return "Senior"
    return "Desconocido"
}
function mostrarEquipos(usuarioBD){
    const MAIN_ENTRENADOR = document.getElementById('main-entrenador') // declaramos como constante el main en el que vamos a trabajar
    let listaEquipos = store.equipo.getAll()
    console.log(usuarioBD.clubAsoc)
    if(usuarioBD.rol === 'entrenador' && location.pathname ==='/equipos.html'){ // si el usuario es entrenador le lanzamos un area para trabajar
        borradoContenedoresPerfil(MAIN_ENTRENADOR)// le pasamos la constante a la funcion de borrado para dejar limpio el main

        //Creamos la estructura del area de trabajo
        let h1 = document.createElement('h1') 
        h1.innerText = 'Gestion de equipos' 
        MAIN_ENTRENADOR?.appendChild(h1) 

        let h3 = document.createElement('h3')
        h3.innerText = 'Selecciona un equipo:'
        MAIN_ENTRENADOR?.appendChild(h3)

        let select = document.createElement('select')
        select.id = 'select-equipo-gestionar'
        MAIN_ENTRENADOR?.appendChild(select)

        listaEquipos.forEach((/** @type {Equipo} */ equipo) => {
            if(equipo.clubAsoc === usuarioBD.clubAsoc){
                let option = document.createElement('option')
                option.value = equipo._id
                option.innerText = equipo.nombre
                select.appendChild(option)
            }

        });

        let sectionEquipoSeleccionado = document.createElement('section')
        sectionEquipoSeleccionado.id = 'equipo-seleccionado'
        MAIN_ENTRENADOR?.appendChild(sectionEquipoSeleccionado)
        
        select.addEventListener('change', (event) => {
            let valorSelect = event.target.value
            borradoContenedoresPerfil(sectionEquipoSeleccionado)
            gestionarEquipo(sectionEquipoSeleccionado,valorSelect)
        })
        
    }
}
function gestionarEquipo(sectionEquipoSeleccionado,nombreSelect){
    let equipoSeleccionado = store.equipo.getById(nombreSelect)
    
    let form = document.createElement('form')
    form.id = 'form-añadir-jugadores'
    sectionEquipoSeleccionado.appendChild(form)

    let h2 = document.createElement('h2')
    h2.innerText = equipoSeleccionado.nombre + ' - ' + equipoSeleccionado.categoria
    document.getElementById('form-añadir-jugadores').appendChild(h2)

    let jugadoresClubCategoria = filtrarJugadores(equipoSeleccionado)
    if(jugadoresClubCategoria.length > 0){
        jugadoresClubCategoria.forEach((jugador) => {
            let p = document.createElement('p')
            p.innerText = jugador.nombre + ' ' + jugador.apellidos
            document.getElementById('form-añadir-jugadores').appendChild(p)
    })
    }else{
        let p = document.createElement('p')
        p.innerText = 'No hay jugadores de esta edad seleccionables para este equipo'
        sectionEquipoSeleccionado.appendChild(p)
    }
    //DOING ESTA FUNCION SOLO ES PARA MOSTRAR EQUIPOS DE UN CLUB Y SUS JUGADORES en esa categoria SIN AÑADIR, PARA PODER AÑADIRLOS LUEGO TENDREMOS QUE TENER OTRA QUE MUESTRE LOS YA AÑADIDOS
}

function filtrarJugadores(equipo){
    let listaJugadores = JSON.parse(localStorage.getItem('REDUX_DB')).jugadores


    let jugadoresClub = listaJugadores.filter(jugador => jugador.club === equipo.clubAsoc)

    let jugadoresCategoria = jugadoresClub.filter(jugador => jugador.categoria.toLowerCase() === equipo.categoria.toLowerCase())

    return jugadoresCategoria

    
}





















