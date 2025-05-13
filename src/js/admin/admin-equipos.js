import { getAPIData, API_PORT,borradoContenedoresPerfil, mayusculasInicial } from '../utils.js'
import { Equipo } from '../classes/Equipo.js';
export async function menuAdminEquipo(usuarioLogeado){
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/equipos/${usuarioLogeado.codigo}`,'GET')

    const DIV_OPCIONES = document.getElementById('opciones');

    if(DIV_OPCIONES) {
        borradoContenedoresPerfil(DIV_OPCIONES)
    }

    const MENU_FILTROS = document.createElement('lit-admin-filter-bar')
    MENU_FILTROS.opciones = ['Benjamin','Alevin','Infantil','Cadete','Juvenil','Senior','Mostrar todos']
    MENU_FILTROS.boton = true
    DIV_OPCIONES.appendChild(MENU_FILTROS)
    return apiData
}

export function mostrarEquiposAdmin(e,equipos){
    let categoria_filtrada = e.detail.opcion.toLowerCase()

    if(categoria_filtrada === 'mostrar todos'){
        pintarEquiposFiltrados(equipos)
    }

    if(categoria_filtrada === 'benjamin'){
        pintarEquiposFiltrados(equipos.filter(equipo => equipo.categoria === 'benjamin'))
    }

    if(categoria_filtrada === 'alevin'){
        pintarEquiposFiltrados(equipos.filter(equipo => equipo.categoria === 'alevin'))
    }

    if(categoria_filtrada === 'infantil'){
        pintarEquiposFiltrados(equipos.filter(equipo => equipo.categoria === 'infantil'))
    }
    
    if(categoria_filtrada === 'cadete'){
        pintarEquiposFiltrados(equipos.filter(equipo => equipo.categoria === 'cadete'))
    }
    
    if(categoria_filtrada === 'juvenil'){
        pintarEquiposFiltrados(equipos.filter(equipo => equipo.categoria === 'juvenil'))
    }
    
    if(categoria_filtrada === 'senior'){
        pintarEquiposFiltrados(equipos.filter(equipo => equipo.categoria === 'senior'))
    }
}
function pintarEquiposFiltrados(equipos){

    const DIV_EQUIPOS = document.getElementById('equipos')

    if(DIV_EQUIPOS) {
        borradoContenedoresPerfil(DIV_EQUIPOS)
    }

    equipos.forEach(equipo => {
        const card = document.createElement('div')
        card.className = 'equipo-card'

        const h3 = document.createElement('h3')
        h3.textContent = equipo.nombre
        card.appendChild(h3)

        const cat = document.createElement('p')
        cat.textContent = 'Categoría: ' + mayusculasInicial(equipo.categoria)
        card.appendChild(cat);

        const patro = document.createElement('p')
        if(equipo.patrocinador !== ''){
            patro.textContent = 'Patrocinador: ' + equipo.patrocinador
        }else{
            patro.textContent = 'Sin patrocinador'
        }
        card.appendChild(patro)

        const jugadores = document.createElement('p');

        if(equipo.jugadores.length > 0){
            jugadores.textContent = 'Jugadores: ' + equipo.jugadores.length
        } else {
            jugadores.textContent = 'Sin jugadores añadidos aun'
        }

        card.appendChild(jugadores)

        DIV_EQUIPOS.appendChild(card)
    });
}
export function crearEquipo(e,usuarioLogeado){
    console.log('creando equipo')

    const DIV_EQUIPOS = document.getElementById('equipos')
    const DIV_MENSAJES = document.getElementById('mensajes')

    if(DIV_EQUIPOS) {
        borradoContenedoresPerfil(DIV_EQUIPOS)
    }

    const card = document.createElement('div')
    card.className = 'nuevo-equipo-card'

    const h3 = document.createElement('h3')
    h3.textContent = 'Crea nuevo equipo para su club'
    card.appendChild(h3)

    const input_nombre = document.createElement('input')
    input_nombre.name = 'nombre'
    input_nombre.id = 'nombre'
    input_nombre.type = 'text'
    input_nombre.placeholder = 'Nombre del equipo'
    card.appendChild(input_nombre)

    const input_categoria = document.createElement('select')
    input_categoria.name = 'categoria'
    input_categoria.id = 'categoria'
    const opciones = ['Benjamin','Alevin','Infantil','Cadete','Juvenil','Senior']
    opciones.forEach(opcion => {
        const option = document.createElement('option')
        option.value = opcion
        option.textContent = opcion
        input_categoria.appendChild(option)
    })
    card.appendChild(input_categoria)

    const input_patro = document.createElement('input')
    input_patro.type = 'text'
    input_patro.placeholder = 'Patrocinador del equipo'
    card.appendChild(input_patro)

    const button = document.createElement('button')
    button.textContent = 'Crear equipo'
    card.appendChild(button)
  
    button.addEventListener('click', () => {
        if(input_nombre.value !== ''){
            const nuevo_equipo = new Equipo(
            input_nombre.value,input_categoria.value,input_patro.value,[],usuarioLogeado.codigo
            )
            addEquipoBBDD(nuevo_equipo)
        }else{
            const error = document.createElement('p')
            error.textContent = 'El nombre del equipo no puede estar vacio'
            error.classList.add('error')

            if(DIV_MENSAJES){
                borradoContenedoresPerfil(DIV_MENSAJES)
            }

            DIV_MENSAJES.appendChild(error)
            setTimeout(() => {error.remove()}, 2000)
        }

    
    })

    DIV_EQUIPOS.appendChild(card)
}

async function addEquipoBBDD(nuevoEquipo){
    console.log(nuevoEquipo)

    const DIV_MENSAJES = document.getElementById('mensajes')

    if(DIV_MENSAJES){
        borradoContenedoresPerfil(DIV_MENSAJES)
    }

    const payload = JSON.stringify(nuevoEquipo)

    await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/equipo`, 'POST', payload)

    const equipoCreado = document.createElement('p')
    equipoCreado.textContent = nuevoEquipo.nombre + ' creado con exito'
    DIV_MENSAJES.appendChild(equipoCreado)

    setTimeout(() => {equipoCreado.remove()}, 2000)
    setTimeout(() => {window.location.reload()}, 3000)

}