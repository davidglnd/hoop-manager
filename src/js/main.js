//@ts-expect-error //TO DO arreglar y trabajar en el main
 
import { Jugador } from "./classes/Jugador.js";
import { getAPIData } from './utils.js'
import { calculoCategoria, fechaEstandar } from './utils.js'

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

    let templateCalendario = document.getElementById('template-calendario')

    templateCalendario?.addEventListener('equipo-cambiado', (e) => mostrarCalendario (e))

    leerEquipos(usuarioLogeado)
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
        nombre: name,
        apellidos:apellidos,
        email: email,
        telefono: telefono
    }
    
    if(usuario.nombre === name && usuario.apellidos === apellidos && usuario.email === email && usuario.telefono === telefono){
        console.log('No hay cambios')
        borradoContenedoresPerfil(document.getElementById('informacion-usuario'))
        mostrarPerfil(usuario)
    }else{
        await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/user/${usuario._id}`, 'PUT', JSON.stringify(usuarioModificado))
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
 * Reads the list of Equipos from local storage and updates the store
 * array with the read data.
 *
 * If no data is found in local storage, the global store is left unchanged.
 *
 * @returns {void}
 * @import { Equipo } from "./classes/Equipo.js"; 
 */
async function leerEquipos(userLogeado){
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/equipos/${userLogeado.clubAsoc}`, 'GET')

    mostrarEquipos(apiData)
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

async function mostrarCalendario(e){ // TO DO MODIFICACIONES PARA ENTRENADORES
    let idEquipoSeleccionado = e.detail.equipo // obtenemos el id del equipo seleccionado en el select

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/calendario/${idEquipoSeleccionado}`, 'GET')

    const MAIN_CALENDARIO = document.getElementById('main-calendario')

    //borramos el calendario anterior
    const calendarioExistente = document.getElementById('calendario');
    if (calendarioExistente) {
        calendarioExistente.remove();
    }
    //creamos el calendario y comprobamos si tiene calendario ya asignado esa categoria
    if(apiData === null){
        const DIV_CALENDARIO = document.createElement('div') 
        DIV_CALENDARIO.id = 'calendario'
        DIV_CALENDARIO.innerHTML = `<h2>No hay calendario para esta categoria</h2>`
        MAIN_CALENDARIO?.appendChild(DIV_CALENDARIO)
    }else{ 
        const DIV_CALENDARIO = document.createElement('div') 
        DIV_CALENDARIO.id = 'calendario'
        DIV_CALENDARIO.innerHTML = `<table id="tabla-calendario"><caption>Temporada ${apiData.temporada}- Categoria ${apiData.categoria} </caption><tr><th></th><th>Fecha</th><th>Equipo local</th><th>Equipo visitante</th><th>Ubicacion</th></tr></table>`
    
        MAIN_CALENDARIO?.appendChild(DIV_CALENDARIO)    
    
        const TABLA_CALENDARIO = document.getElementById('tabla-calendario')
        if(apiData.partidos.length === 0){
            const TR_SIN_PARTIDOS = document.createElement('tr')
            TR_SIN_PARTIDOS.innerHTML = `<td colspan="5">Añadiendo partidos.....</td>`
            TABLA_CALENDARIO?.appendChild(TR_SIN_PARTIDOS)
        }else{
            apiData.partidos.forEach(partido => {
                const TR_PARTIDO = document.createElement('tr')
                TR_PARTIDO.innerHTML = `<td>Jornada nº ${partido.jornada}</td><td>${fechaEstandar(partido.fecha)}</td><td>${partido.local}</td><td>${partido.visitante}</td><td><a href="${partido.ubicacion}">Pabellon de ${partido.local}</a></td>`
                TABLA_CALENDARIO?.appendChild(TR_PARTIDO)
            })
        }
    }

 
}
function mostrarEquipos(equiposBD){
    const MAIN_ENTRENADOR = document.getElementById('main-entrenador') // declaramos como constante el main en el que vamos a trabajar
    const userLogeado = JSON.parse(sessionStorage.getItem('HOOP_MANAGER'))

    if(userLogeado.rol === 'entrenador' && location.pathname ==='/equipos.html'){ // si el usuario es entrenador le lanzamos un area para trabajar
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

        equiposBD.forEach((/** @type {Equipo} */ equipo) => {
                let option = document.createElement('option')
                option.value = equipo._id
                option.innerText = equipo.nombre
                select.appendChild(option)

        });

        let sectionEquipoSeleccionado = document.createElement('section')
        sectionEquipoSeleccionado.id = 'equipo-seleccionado'
        MAIN_ENTRENADOR?.appendChild(sectionEquipoSeleccionado)
        
        select.addEventListener('change', (event) => {
            let valorSelect = event.target.value
            borradoContenedoresPerfil(sectionEquipoSeleccionado)
            
            let botonGestionJugadores = document.createElement('button')
            botonGestionJugadores.innerText = 'Gestionar equipo'
            botonGestionJugadores.addEventListener('click', () => gestionarEquipo(sectionEquipoSeleccionado,valorSelect))
            
            let botonVerEquipo = document.createElement('button')
            botonVerEquipo.innerText = 'Ver equipo'
            botonVerEquipo.addEventListener('click', () => verEquipo(sectionEquipoSeleccionado,valorSelect))

            sectionEquipoSeleccionado.appendChild(botonGestionJugadores)
            sectionEquipoSeleccionado.appendChild(botonVerEquipo)
        })
        
    }
}
async function gestionarEquipo(sectionEquipoSeleccionado,valorSelect){
    borradoContenedoresPerfil(sectionEquipoSeleccionado)
    let equipoSeleccionado =  await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/equipo/${valorSelect}`, 'GET')
    console.log(equipoSeleccionado)
    let form = document.createElement('form')
    form.id = 'form-añadir-jugadores'
    sectionEquipoSeleccionado.appendChild(form)

    let h2 = document.createElement('h2')
    h2.innerText = equipoSeleccionado.nombre + ' - ' + equipoSeleccionado.categoria
    document.getElementById('form-añadir-jugadores').appendChild(h2)

    let listadoJugadoresSinEquipo = await filtrarJugadores(equipoSeleccionado)

    if(listadoJugadoresSinEquipo.length > 0){
        listadoJugadoresSinEquipo.forEach((jugador) => {
            let label = document.createElement('label')
            label.innerText = jugador.nombre + ' ' + jugador.apellidos + '-' + jugador.fnac
            let check = document.createElement('input')
            check.type = 'checkbox'
            check.name = 'jugador'
            check.value = jugador._id
            document.getElementById('form-añadir-jugadores').appendChild(label)
            document.getElementById('form-añadir-jugadores').appendChild(check)
            
        })
        let addJugadores = document.createElement('button')
        addJugadores.type = 'submit'
        addJugadores.id = 'boton-añadir-jugadores'
        addJugadores.innerText = 'Añadir jugadores seleccionados'
        document.getElementById('form-añadir-jugadores').appendChild(addJugadores)
        form.addEventListener('submit',(event) => enviarJugadores(event,equipoSeleccionado))
    }else{
        let p = document.createElement('p')
        p.innerText = 'No hay jugadores seleccionables para este equipo'
        sectionEquipoSeleccionado.appendChild(p)
    }
    //DOING ESTA FUNCION SOLO ES PARA MOSTRAR EQUIPOS DE UN CLUB Y SUS JUGADORES en esa categoria SIN AÑADIR, PARA PODER AÑADIRLOS LUEGO TENDREMOS QUE TENER OTRA QUE MUESTRE LOS YA AÑADIDOS
}

async function filtrarJugadores(equipo){
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/jugadores/${equipo.categoria}`, 'GET')
    return apiData
}

async function enviarJugadores(event,idEquipo){
    event.preventDefault()
    let checkboxes = event.target.querySelectorAll('input[type="checkbox"][name="jugador"]')
    const JUGADORES_SELECCIONADOS ={}
    JUGADORES_SELECCIONADOS.equipo = idEquipo
    JUGADORES_SELECCIONADOS.jugadores = []

    checkboxes.forEach((checkbox) => {
        if(checkbox.checked){
            JUGADORES_SELECCIONADOS.jugadores.push(checkbox.value)
        }
    })
    console.log(JUGADORES_SELECCIONADOS)
    const payload = JSON.stringify(JUGADORES_SELECCIONADOS)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/equipo/jugadores`, 'POST', payload)
    console.log(apiData)
}
async function verEquipo(sectionEquipoSeleccionado,valorSelect){
    borradoContenedoresPerfil(sectionEquipoSeleccionado)
    let equipoSeleccionado =  await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/equipos/jugadores/${valorSelect}`, 'GET')
    console.log(equipoSeleccionado)

    let nombreEquipo = document.createElement('p')
    nombreEquipo.innerText = 'Nombre del equipo: ' + equipoSeleccionado.EQUIPO_SELECCIONADO.nombre
    sectionEquipoSeleccionado.appendChild(nombreEquipo)

    let categoriaEquipo = document.createElement('p')
    categoriaEquipo.innerText = 'Categoria del equipo: ' + mayusculasInicial(equipoSeleccionado.EQUIPO_SELECCIONADO.categoria)
    sectionEquipoSeleccionado.appendChild(categoriaEquipo)

    if(equipoSeleccionado.JUGADORES_EQUIPO.length === 0 ){
        let errorJugadores = document.createElement('p')
        errorJugadores.innerText = 'Este equipo no tiene jugadores asignados'
        sectionEquipoSeleccionado.appendChild(errorJugadores)
    }else{
        equipoSeleccionado.JUGADORES_EQUIPO.forEach(jugador => {
            let divJugador = document.createElement('div')
            sectionEquipoSeleccionado.appendChild(divJugador)

            let nombreJugador = document.createElement('p')
            nombreJugador.innerText =jugador.nombre + ' ' + jugador.apellidos
            divJugador.appendChild(nombreJugador)

            let fnacJugador = document.createElement('p')
            let [dia, mes, anio] = jugador.fnac.split('-')
            fnacJugador.innerText = 'Fecha de nacimiento: ' + dia + '/' + mes + '/' + anio
            divJugador.appendChild(fnacJugador)

            if(jugador.categoria === 'alevin' || jugador.categoria === 'benjamin'){
                let sexoJugador = document.createElement('p')
                sexoJugador.innerText = 'Sexo: ' + jugador.sexo
                divJugador.appendChild(sexoJugador)
            }

            //TO DO un select para cambiar la posicion del jugador y un boton para actualizarla
            //TO DO un boton para eliminar el jugador del equipo
        })
    }
}   

















