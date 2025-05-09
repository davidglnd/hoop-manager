//@ts-check
import { getAPIData,API_PORT } from '../utils.js'
import { fechaEstandar } from '../utils.js'

/**
 * Muestra el calendario de un equipo en la pantalla.
 * 
 * @param {object} e - Un objeto Event que contiene la informaci n del equipo
 *                    que se va a mostrar.
 * @param {object} e.detail - Informacion que trae el evento
 * @param {string} e.detail.equipo - Informacion del equipo a mostrar
 * 
 * @returns {Promise<void>}
 */
export async function mostrarCalendario(e){ // TO DO MODIFICACIONES PARA ENTRENADORES
    console.log('mostrando calendario')
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
            apiData.partidos.forEach((/** @type {{ jornada: any; fecha: string; local: any; visitante: any; ubicacion: any; }} */ partido) => {
                const TR_PARTIDO = document.createElement('tr')
                TR_PARTIDO.innerHTML = `<td>Jornada nº ${partido.jornada}</td><td>${fechaEstandar(partido.fecha)}</td><td>${partido.local}</td><td>${partido.visitante}</td><td><a href="${partido.ubicacion}">Pabellon de ${partido.local}</a></td>`
                TABLA_CALENDARIO?.appendChild(TR_PARTIDO)
            })
        }
    }

 
}