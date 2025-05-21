//@TS-check
import { getAPIData,API_PORT,fechaEstandar } from '../utils.js'


/**
 * Borra el contenido de los divs #div-equipos y #div-convocatorias si existen.
 *
 * Este m todo se utiliza para resetear el contenido de la pantalla cada vez
 * que se muestra o se actualiza la informaci n de un equipo o una convocatoria.
 */
function resetearEspacio(){
    const equipoExistente = document.getElementById('div-equipos');
    if (equipoExistente) {
        equipoExistente.remove();
    }

    const convocatoriaExistente = document.getElementById('div-convocatorias');
    if (convocatoriaExistente) {
        convocatoriaExistente.remove();
    }
}
/**
 * Muestra la informaci n de un equipo en la pantalla.
 * 
 * @param {object} e - Un objeto Event que contiene la informaci n del equipo
 *                    que se va a mostrar.
 * @param {object} e.detail - Informacion que trae el evento
 * @param {object} e.detail.equipo - Informacion del equipo
 * @returns {Promise<void>}
 */
export async function mostrarEquipos(e) {
    let usuarioLogeado = JSON.parse(sessionStorage.getItem('HOOP_MANAGER') ?? '')

    const MAIN_ENTRENADOR = document.getElementById('main-entrenador')
    resetearEspacio()

    const DIV_EQUIPOS = document.createElement('div')
    DIV_EQUIPOS.id = 'div-equipos'

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/equipos/jugadores/${e.detail.equipo}`, 'GET')
    console.log(apiData)

    const tabla = crearTablaEquipo(apiData)
    DIV_EQUIPOS.appendChild(tabla)
    console.log(usuarioLogeado)
    if(usuarioLogeado.rol === 'entrenador'){
        reemplazarBotonesEntrenador(apiData)
    }else if (usuarioLogeado.rol === 'familiar') {
        reemplazarBotonesFamiliar(apiData)
    }

    MAIN_ENTRENADOR?.appendChild(DIV_EQUIPOS)
}
/**
 * Creates a table element displaying team information and players.
 *
 * @param {Object} apiData - Data containing the selected team's details and players.
 * @param {Object} apiData.EQUIPO_SELECCIONADO - The selected team object.
 * @param {string} apiData.EQUIPO_SELECCIONADO.nombre - The name of the selected team.
 * @param {Array<{ nombre: string, apellidos: string, fnac: string }>} apiData.JUGADORES_EQUIPO - Array of players in the selected team.
 * @returns {HTMLTableElement} A table element with team and player information.
 */

function crearTablaEquipo(apiData) {
    const tabla = document.createElement('table')
    tabla.id = 'tabla-equipos'

    const caption = document.createElement('caption')
    caption.textContent = apiData.EQUIPO_SELECCIONADO.nombre
    tabla.appendChild(caption)

    const thead = document.createElement('thead')
    thead.innerHTML = `<tr><th>Nombre</th><th>Apellidos</th><th>Fecha de nacimiento</th></tr>`
    tabla.appendChild(thead)

    const tbody = document.createElement('tbody')

    if (apiData.JUGADORES_EQUIPO.length === 0) {
        const tr = document.createElement('tr')
        tr.innerHTML = `<td colspan="3">Aún no se han añadido jugadores</td>`
        tbody.appendChild(tr)
    } else {
        apiData.JUGADORES_EQUIPO.forEach(jugador => {
            const tr = document.createElement('tr')
            tr.innerHTML = `<td><a href="jugador.html" target="_blank">${jugador.nombre}</a></td><td>${jugador.apellidos}</td><td>${fechaEstandar(jugador.fnac)}</td>`
            tbody.appendChild(tr)
        })
    }

    tabla.appendChild(tbody)
    return tabla
}
/**
 * Replaces the existing 'add-jugadores' and 'convocatoria' buttons with new ones
 * and attaches event listeners to them. The 'add-jugadores' button will trigger
 * the addition of players to the selected team, while the 'convocatoria' button
 * will create a call-up for the team. The function uses the provided `apiData`
 * to obtain details such as the team category, ID, and associated club.
 *
 * @param {Object} apiData - The data containing details of the selected team
 * @param {Object} apiData.EQUIPO_SELECCIONADO 
 * @param {string} apiData.EQUIPO_SELECCIONADO.categoria 
 * @param {string} apiData.EQUIPO_SELECCIONADO._id 
 * @param {string} apiData.EQUIPO_SELECCIONADO.clubAsoc
 */

function reemplazarBotonesEntrenador(apiData) {
    const oldAdd = document.getElementById('add-jugadores')
    const oldConv = document.getElementById('convocatoria')

    //cloneNode(true) copia el elemento y su HTML interno, pero no los event listeners.
    const newAdd = oldAdd?.cloneNode(true)
    const newConv = oldConv?.cloneNode(true)

    // @ts-expect-error eror esperado para no añadir mas lineas
    oldAdd?.replaceWith(newAdd)
     // @ts-expect-error eror esperado para no añadir mas lineas
    oldConv?.replaceWith(newConv)

    newAdd?.addEventListener('click', () => 
        addJugadores(apiData.EQUIPO_SELECCIONADO.categoria, apiData.EQUIPO_SELECCIONADO._id, apiData.EQUIPO_SELECCIONADO.clubAsoc)
    )
    newConv?.addEventListener('click', () => 
        crearConvocatoria(apiData.EQUIPO_SELECCIONADO._id)
    )
}

/**
 * Reemplaza el bot n 'ver-convocatoria' con uno nuevo que tiene un event listener
 * que llama a la funci n verConvocatorias() con el id del equipo seleccionado.
 *
 * @param {Object} apiData - The data containing details of the selected team
 * @param {Object} apiData.EQUIPO_SELECCIONADO - The selected team object
 * @param {string} apiData.EQUIPO_SELECCIONADO._id - The ID of the selected team
 */
function reemplazarBotonesFamiliar(apiData) {
    const oldConv = document.getElementById('ver-convocatoria')
    
    //cloneNode(true) copia el elemento y su HTML interno, pero no los event listeners.
    const newConv = oldConv?.cloneNode(true)

    // @ts-expect-error eror esperado para noañadir mas lineas
    oldConv?.replaceWith(newConv)
    console.log(apiData.EQUIPO_SELECCIONADO._id)
    newConv?.addEventListener('click', () => 
        verConvocatorias(apiData.EQUIPO_SELECCIONADO._id)
    )

}
/**
 * Removes the existing 'add-jugadores' button and 'tabla-equipos' from the DOM and
 * then creates a new table with the available players from the same category as
 * the selected team, and a button to add the selected players to the team.
 * The function uses the provided parameters to obtain the players and display
 * them in the table. The players that are not part of the selected team or do not
 * have an associated team are included in the table.
 *
 * @param {string} categoria - The category of the selected team
 * @param {string} idEquipo - The id of the selected team
 * @param {string} club - The club associated with the selected team
 */
async function addJugadores(categoria,idEquipo,club){
    const tablaExistente = document.getElementById('tabla-equipos');
    const tablaJugadoresLibresExistente = document.getElementById('tabla-jugadores-libres');
    const BOTON_ADD_JUGADORES_EXISTENTE = document.getElementById('add-jugadores');
    if (tablaExistente) {
        tablaExistente.remove();
    }else if(tablaJugadoresLibresExistente && BOTON_ADD_JUGADORES_EXISTENTE){
        tablaJugadoresLibresExistente.remove();
        BOTON_ADD_JUGADORES_EXISTENTE.remove();
    }

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/jugadores/${categoria}`, 'GET')
    const DIV_EQUIPOS = document.getElementById('div-equipos')

    let tablaJugadoresLibres = document.createElement('table')
    tablaJugadoresLibres.id = 'tabla-jugadores-libres'
    tablaJugadoresLibres.innerHTML = `<tr><th>Nombre</th><th>Apellidos</th><th>Fecha de nacimiento</th><th>Categoria</th><th>Seleccionar</th></tr>`
    console.log(apiData)
    apiData.forEach((/** @type {{ club: string; _id_equipo: string; nombre: any; apellidos: any; fnac: any; categoria: any; _id: any; }} */ jugador) => {
        if(club !== jugador.club){
            
            console.log('hay jugadores que no son del club')

        }else if(jugador._id_equipo !== idEquipo || !jugador._id_equipo){

            const TR_JUGADOR = document.createElement('tr')
            TR_JUGADOR.innerHTML = `<td>${jugador.nombre}</td><td>${jugador.apellidos}</td><td>${jugador.fnac}</td><td>${jugador.categoria}</td>
                                    <td><input type="checkbox" name="jugador" value="${jugador._id}" class="select-jugador"></td>` 
            tablaJugadoresLibres.appendChild(TR_JUGADOR)
            
        }
    })
    DIV_EQUIPOS?.appendChild(tablaJugadoresLibres)
    
    const BOTON_ADD_JUGADORES = document.createElement('button')
    BOTON_ADD_JUGADORES.id = 'add-jugadores'
    BOTON_ADD_JUGADORES.innerText = 'Añadir seleccion'
    BOTON_ADD_JUGADORES.classList = 'button'
    BOTON_ADD_JUGADORES.addEventListener('click', (event) => enviarJugadores(event,idEquipo))


    DIV_EQUIPOS?.appendChild(BOTON_ADD_JUGADORES)
    
}
/**
 * Handles the submission of the "Añadir seleccion" button.
 * Prevents the default form submission, retrieves the checked checkboxes
 * and sends a POST request to the server with the selected players and the
 * id of the team. Reloads the page after the request is sent.
 * @param {Event} event - The event that triggered this function.
 * @param {string} idEquipo - The id of the team.
 */
async function enviarJugadores(event,idEquipo){
    event.preventDefault()
    let checkboxes = document.querySelectorAll('input[type="checkbox"][name="jugador"]')
    const JUGADORES_SELECCIONADOS ={}
    JUGADORES_SELECCIONADOS.equipo = idEquipo
    /**
     * @type {any[]}
     */
    JUGADORES_SELECCIONADOS.jugadores = []

    checkboxes.forEach((checkbox) => {
        if(checkbox instanceof HTMLInputElement && checkbox.checked  ){
            JUGADORES_SELECCIONADOS.jugadores.push(checkbox.value)
        }
    })
    

    const payload = JSON.stringify(JUGADORES_SELECCIONADOS)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/equipo/jugadores`, 'POST', payload)
    console.log(apiData)

    location.reload()
}
    /**
     * Handles the button to create a call-up for the selected team.
     * Prevents the default form submission, resets the main space, and
     * retrieves the team's schedule from the server. If there is no schedule
     * or no games, it displays a message in the main space. If there are games
     * it creates a select element with the games and adds an event listener to
     * it. When a game is selected, it calls the function mostrarPartido with
     * the event and the id of the team.
     * @param {string} idEquipo - The id of the team.
     */
async function crearConvocatoria(idEquipo) {
    resetearEspacio()

    const MAIN_ENTRENADOR = document.getElementById('main-entrenador')
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/calendario/${idEquipo}`, 'GET')

    if(apiData === null){
        const DIV_CONVOCATORIAS = document.createElement('div')
        DIV_CONVOCATORIAS.id = 'div-convocatorias'
        MAIN_ENTRENADOR?.appendChild(DIV_CONVOCATORIAS)
        const H2_CONVOCATORIAS = document.createElement('h2')
        H2_CONVOCATORIAS.innerText = 'No hay calendario para esta categoria'
        DIV_CONVOCATORIAS.appendChild(H2_CONVOCATORIAS)
        return
    }else if(apiData.partidos.length === 0){
        const DIV_CONVOCATORIAS = document.createElement('div')
        DIV_CONVOCATORIAS.id = 'div-convocatorias'
        MAIN_ENTRENADOR?.appendChild(DIV_CONVOCATORIAS)
        const H2_CONVOCATORIAS = document.createElement('h2')
        H2_CONVOCATORIAS.innerText = 'No hay partidos'
        DIV_CONVOCATORIAS.appendChild(H2_CONVOCATORIAS)
        return
    }

    const DIV_CONVOCATORIAS = document.createElement('div')
    DIV_CONVOCATORIAS.id = 'div-convocatorias'
    MAIN_ENTRENADOR?.appendChild(DIV_CONVOCATORIAS)

    const SELECT_PARTIDOS = document.createElement('select')
    SELECT_PARTIDOS.id = 'select-partidos'
    SELECT_PARTIDOS.classList = 'select'
    apiData.partidos.forEach((/** @type {{ fecha: string | number | Date; local: any; visitante: any; }} */ partido) => {
        if(new Date(partido.fecha) > new Date()){
            const OPTION_PARTIDO = document.createElement('option')
            OPTION_PARTIDO.value = JSON.stringify(partido)
            OPTION_PARTIDO.innerText = `${partido.local} vs ${partido.visitante}`
            SELECT_PARTIDOS.appendChild(OPTION_PARTIDO)
        }else{
            const OPTION_PARTIDO = document.createElement('option')
            OPTION_PARTIDO.disabled = true
            OPTION_PARTIDO.innerText = `Partido ya jugado`
            SELECT_PARTIDOS.appendChild(OPTION_PARTIDO)
        }
    })
    DIV_CONVOCATORIAS.appendChild(SELECT_PARTIDOS)

    SELECT_PARTIDOS.addEventListener('change', (event) => mostrarPartido(event,idEquipo))

}

    /**
     * Handles the change event of the select element that displays the games
     * of the selected team. When a game is selected, it resets the main space,
     * retrieves the team's players from the server, and creates a card-match
     * component with the selected game and the team's players. The id of the
     * team is passed as a parameter to this function.
     * @param {Event} e - The event that triggered this function.
     * @param {string} idEquipo - The id of the team.
     */
async function mostrarPartido(e,idEquipo){
    // @ts-expect-error TO DO
    const PARTIDO = JSON.parse(e.target.value)

    resetearEspacio()

    const MAIN_ENTRENADOR = document.getElementById('main-entrenador')
    
    const DIV_CONVOCATORIAS = document.createElement('div')
    DIV_CONVOCATORIAS.id = 'div-convocatorias'
    MAIN_ENTRENADOR?.appendChild(DIV_CONVOCATORIAS)

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/equipos/jugadores/${idEquipo}`, 'GET')
    
    const CARD = document.createElement('card-match')
    // @ts-expect-error TO DO 
    CARD.partido = PARTIDO
    // @ts-expect-error TO DO 
    CARD.jugadores = apiData.JUGADORES_EQUIPO
    // @ts-expect-error TO DO 
    CARD.idEquipo = idEquipo
    CARD.id = 'comp-card-match-lit'
    DIV_CONVOCATORIAS.appendChild(CARD)
        
}
/**
 * Resets the main space and creates a div with the id 'div-convocatorias' where
 * it displays the convocatorias of the selected team. If there are no convocatorias
 * published, it displays an h2 with the text 'No hay convocatorias publicadas'. If
 * there are convocatorias, it displays an h2 with the text 'Selecciona una jornada'
 * and creates an unordered list with the convocatorias, each li with the id of the
 * corresponding jornada and the text of the jornada. When a li is clicked, it
 * should call the lit component with the selected convocatoria.
 * @param {string} idEquipo - The id of the team.
 */
async function verConvocatorias(idEquipo) {//EXPLICACION DE ESTA FUNCION PARA NO PERDERNOS
    resetearEspacio()

    const MAIN_ENTRENADOR = document.getElementById('main-entrenador')

    const DIV_CONVOCATORIAS = document.createElement('div')
    DIV_CONVOCATORIAS.id = 'div-convocatorias'
    MAIN_ENTRENADOR?.appendChild(DIV_CONVOCATORIAS)

    
    const apiData = await getAPIData(`/api/filter/calendario/${idEquipo}`, 'GET')



    if(!apiData.convocatoria){
        const H2_CONVOCATORIAS = document.createElement('h2')
        H2_CONVOCATORIAS.innerText = 'No hay convocatorias publicadas'
        DIV_CONVOCATORIAS.appendChild(H2_CONVOCATORIAS)
        return
    }else{
        const UL_CONVOCATORIAS = document.createElement('ul')
        UL_CONVOCATORIAS.id = 'ul-convocatorias'
        DIV_CONVOCATORIAS.appendChild(UL_CONVOCATORIAS)
        //AQUI CUANDO YA SABEMOS QUE HAY CONVOCATORIA EMPIEZA EL FOLLON 
        apiData.convocatoria.forEach((/** @type {{ jornada: string; mensaje_convocatoria: string; jugadores_convocados: any[]; }} */ convocatoria) => { // RECORREMOS PRIMERO LA CONVOCATORIA
            const LI_CONVOCATORIA = document.createElement('li')
            const LIT_CARD_CONVOCATORIA = document.createElement('card-convocatoria')// CREAMOS EL ELEMENTO DE LIT
            LIT_CARD_CONVOCATORIA.setAttribute('jornada', convocatoria.jornada) // LE METEMOS LA PRIMERA PROPIEDAD (JORNADA QUE LA SACAMOS DE LA CONVOCATORIA)
            LIT_CARD_CONVOCATORIA.setAttribute('mensaje',convocatoria.mensaje_convocatoria)

            apiData.partidos.forEach((/** @type {{ jornada: { toString: () => string; }; fecha: string; local: string; mensaje_convocatoria: string; visitante: any; }} */ partido) => {// RECORREMOS LOS PARTIDOS DE LA TEMPORADA 
                if(partido.jornada.toString() === convocatoria.jornada){// CUANDO EL PARTIDO DE LA TEMPORADA TENGA LA JORNADA DE LA CONVOCATORIA
                    LIT_CARD_CONVOCATORIA.setAttribute('fecha', fechaEstandar(partido.fecha))// EMPEZAMOS A METER MAS PROPIEDADES EN EL LIT COMPONENT
                    LIT_CARD_CONVOCATORIA.setAttribute('ubicacion',partido.local)

                    let equipos = []
                    equipos.push(partido.local, partido.visitante)
                    // @ts-expect-error TO DO 
                    LIT_CARD_CONVOCATORIA.equipos = equipos
                    console.log(partido.mensaje_convocatoria)
                }
            })
            /**
             * @type {{ nombre: any; apellidos: any; }[]}
             */
            let jugadores = []


            convocatoria.jugadores_convocados.forEach((/** @type {{ nombre: any; apellidos: any; }} */ jugador) => {// PARA METER LOS JUGADORES NECESITAMOS RECORRER LA CONVOCATORIA Y METER LOS JUGADORES_CONVOCADOS
                jugadores.push({nombre: jugador.nombre,apellidos: jugador.apellidos})
            })

            // @ts-expect-error TO DO
            LIT_CARD_CONVOCATORIA.jugadores = jugadores

            UL_CONVOCATORIAS.appendChild(LI_CONVOCATORIA)// AÑADIMOS EL LI
            LI_CONVOCATORIA.appendChild(LIT_CARD_CONVOCATORIA)// AÑADIMOS EL LIT COMPONENT AL LI

        })
    }
}
/**
 * Handles the submission of a match card form. Converts the form details
 * into a JSON string and sends a POST request to the server to create
 * a new call-up for the selected match day and season. Upon receiving
 * the server's response, it displays an alert with the response data
 * and reloads the page.
 *
 * @param {CustomEvent} e - The event that triggered this function, containing
 * the details of the match card form submission.
 */

export async function cardMatchSubmit(e){
    const payload = JSON.stringify(e.detail)


    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/convocatoria/temporada/jornada/seleccionada`, 'POST', payload )

    alert(apiData)

    location.reload()
}
