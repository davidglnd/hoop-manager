import { getAPIData,API_PORT } from '../utils.js'
import { fechaEstandar } from '../utils.js'

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
export async function mostrarEquipos(e) {
    
    const MAIN_ENTRENADOR = document.getElementById('main-entrenador')
    resetearEspacio()

    const DIV_EQUIPOS = document.createElement('div')
    DIV_EQUIPOS.id = 'div-equipos'

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/equipos/jugadores/${e.detail.equipo}`, 'GET')
    console.log(apiData)

    const tabla = crearTablaEquipo(apiData)
    DIV_EQUIPOS.appendChild(tabla)

    reemplazarBotones(apiData)

    MAIN_ENTRENADOR?.appendChild(DIV_EQUIPOS)
}
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
            tr.innerHTML = `<td>${jugador.nombre}</td><td>${jugador.apellidos}</td><td>${fechaEstandar(jugador.fnac)}</td>`
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
 * @param {Object} apiData - The data containing details of the selected team,
 * including `EQUIPO_SELECCIONADO` which provides team category, ID, and associated club.
 */

function reemplazarBotones(apiData) {
    const oldAdd = document.getElementById('add-jugadores')
    const oldConv = document.getElementById('convocatoria')

    const newAdd = oldAdd.cloneNode(true)
    const newConv = oldConv.cloneNode(true)

    oldAdd.replaceWith(newAdd)
    oldConv.replaceWith(newConv)

    newAdd.addEventListener('click', () => 
        addJugadores(apiData.EQUIPO_SELECCIONADO.categoria, apiData.EQUIPO_SELECCIONADO._id, apiData.EQUIPO_SELECCIONADO.clubAsoc)
    )
    newConv.addEventListener('click', () => 
        crearConvocatoria(apiData.EQUIPO_SELECCIONADO._id)
    )
}

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
    apiData.forEach((jugador) => {
        if(club !== jugador.club){
            
            console.log('hay jugadores que no son del club')

        }else if(jugador._id_equipo !== idEquipo || !jugador._id_equipo){

            const TR_JUGADOR = document.createElement('tr')
            TR_JUGADOR.innerHTML = `<td>${jugador.nombre}</td><td>${jugador.apellidos}</td><td>${jugador.fnac}</td><td>${jugador.categoria}</td>
                                    <td><input type="checkbox" name="jugador" value="${jugador._id}" class="select-jugador"></td>` 
            tablaJugadoresLibres.appendChild(TR_JUGADOR)
            
        }
    })
    DIV_EQUIPOS.appendChild(tablaJugadoresLibres)
    
    const BOTON_ADD_JUGADORES = document.createElement('button')
    BOTON_ADD_JUGADORES.id = 'add-jugadores'
    BOTON_ADD_JUGADORES.innerText = 'Añadir seleccion'
    BOTON_ADD_JUGADORES.classList = 'button'
    BOTON_ADD_JUGADORES.addEventListener('click', (event) => enviarJugadores(event,idEquipo))


    DIV_EQUIPOS.appendChild(BOTON_ADD_JUGADORES)
    
}
async function enviarJugadores(event,idEquipo){
    event.preventDefault()
    let checkboxes = document.querySelectorAll('input[type="checkbox"][name="jugador"]')
    const JUGADORES_SELECCIONADOS ={}
    JUGADORES_SELECCIONADOS.equipo = idEquipo
    JUGADORES_SELECCIONADOS.jugadores = []

    checkboxes.forEach((checkbox) => {
        if(checkbox.checked){
            JUGADORES_SELECCIONADOS.jugadores.push(checkbox.value)
        }
    })
    

    const payload = JSON.stringify(JUGADORES_SELECCIONADOS)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/equipo/jugadores`, 'POST', payload)
    console.log(apiData)

    location.reload()
}
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
    apiData.partidos.forEach((partido) => {
        if(new Date(partido.fecha) > new Date()){
            const OPTION_PARTIDO = document.createElement('option')
            OPTION_PARTIDO.value = partido.jornada
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

    SELECT_PARTIDOS.addEventListener('change', (event) => mostrarPartido(event))
    
}
function mostrarPartido(e){
    console.log(e.target.value)
    resetearEspacio()

    const MAIN_ENTRENADOR = document.getElementById('main-entrenador')
    
    const DIV_CONVOCATORIAS = document.createElement('div')
    DIV_CONVOCATORIAS.id = 'div-convocatorias'
    MAIN_ENTRENADOR?.appendChild(DIV_CONVOCATORIAS)

    const H1_JORNADA = document.createElement('h1')
    H1_JORNADA.innerText = `Jornada ${e.target.value}`
    DIV_CONVOCATORIAS.appendChild(H1_JORNADA)
}