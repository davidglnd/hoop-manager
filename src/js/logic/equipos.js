import { getAPIData,API_PORT } from '../utils.js'
import { fechaEstandar } from '../utils.js'

function resetearEspacio(){
    //borramos el equipo anterior
    const equipoExistente = document.getElementById('div-equipos');
    if (equipoExistente) {
        equipoExistente.remove();
    }
}
export async function mostrarEquipos(e){

    const MAIN_ENTRENADOR = document.getElementById('main-entrenador') // declaramos como constante el main en el que vamos a trabajar
    const DIV_EQUIPOS = document.createElement('div')
    DIV_EQUIPOS.id = 'div-equipos'

    const userLogeado = JSON.parse(sessionStorage.getItem('HOOP_MANAGER'))
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/equipos/jugadores/${e.detail.equipo}`, 'GET')
    console.log(apiData)
    resetearEspacio()


    const TABLA_EQUIPO = document.createElement('table')
    TABLA_EQUIPO.id = 'tabla-equipos'
    DIV_EQUIPOS.appendChild(TABLA_EQUIPO)



    const CAPTION_EQUIPO = document.createElement('caption')
    CAPTION_EQUIPO.innerText = `${apiData.EQUIPO_SELECCIONADO.nombre}`
    TABLA_EQUIPO.appendChild(CAPTION_EQUIPO)


    
    const TR_JUGADOR = document.createElement('tr')
    
    TR_JUGADOR.innerHTML = `<th>Nombre</th><th>Apellidos</th><th>Fecha de nacimiento</th>`
    TABLA_EQUIPO.appendChild(TR_JUGADOR)

    if(apiData.JUGADORES_EQUIPO.length === 0){
        const TR_SIN_JUGADORES = document.createElement('tr')
        TR_SIN_JUGADORES.innerHTML = `<td colspan="3">Aun no se han añadido jugadores</td>`
        TABLA_EQUIPO.appendChild(TR_SIN_JUGADORES)
    }else{
        apiData.JUGADORES_EQUIPO.forEach((jugador) => {
            const TR_JUGADOR = document.createElement('tr')
            TR_JUGADOR.innerHTML = `<td>${jugador.nombre}</td><td>${jugador.apellidos}</td><td>${fechaEstandar(jugador.fnac)}</td>`
            TABLA_EQUIPO.appendChild(TR_JUGADOR)
        })

    }
    if(userLogeado.rol === 'entrenador'){
        const P_HERRAMIENTAS = document.createElement('p')
        P_HERRAMIENTAS.innerText = 'Añadir jugadores'
        DIV_EQUIPOS.insertBefore(P_HERRAMIENTAS, DIV_EQUIPOS.firstChild)
        P_HERRAMIENTAS.addEventListener('click',() => addJugadores(apiData.EQUIPO_SELECCIONADO.categoria,apiData.EQUIPO_SELECCIONADO._id,apiData.EQUIPO_SELECCIONADO.clubAsoc))
    }


    MAIN_ENTRENADOR?.appendChild(DIV_EQUIPOS)
    
}

async function addJugadores(categoria,idEquipo,club){// TO DO  AÑADIR JUGADORES NO SEA UN P SI NO UN MENU CON MAS OPCIONES DE EDICION DEL EQUIPO COMO BORRAR JUGADORES
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
    tablaJugadoresLibres.innerHTML = `<tr><th>Nombre</th><th>Apellidos</th><th>Fecha de nacimiento</th><th>Seleccionar</th></tr>`
    console.log(apiData)
    apiData.forEach((jugador) => {
        if(club !== jugador.club){
            
            console.log('hay jugadores que no son del club')

        }else if(jugador._id_equipo !== idEquipo || !jugador._id_equipo){

            const TR_JUGADOR = document.createElement('tr')
            TR_JUGADOR.innerHTML = `<td>${jugador.nombre}</td><td>${jugador.apellidos}</td><td>${jugador.fnac}</td>
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