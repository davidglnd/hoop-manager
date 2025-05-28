// import { getAPIData,API_PORT,fechaEstandar } from '../utils.js'
// import { Calendario } from '../classes/Calendario.js'
//TO DO EN DESARROLLO AHORA MISMO SOLO SIMULA CREAR UN CALENDARIO
export function addIdEquipoCalendario(e){
    const ID_EQUIPO = e.detail.equipo
    
    const INPUT_HIDDEN = document.getElementById('id-equipo')

    INPUT_HIDDEN.value = ID_EQUIPO
}
function leerPartidos(){
    let n_partidos = {numero_partidos:document.getElementById('partidos').value,error:false}

    if(n_partidos.numero_partidos < 1 || n_partidos.numero_partidos === ''){
        n_partidos.error = true
    }
    return n_partidos
}

export function handleSubmitAddCalendario(){
    const ID_EQUIPO = document.getElementById('id-equipo').value
    const N_PARTIDOS = leerPartidos()
    if(N_PARTIDOS.error === true){
        window.alert('El numero de partidos debe ser mayor a 0')
    }else if (ID_EQUIPO === '') {
        window.alert('Debes seleccionar un equipo')
    }else{
        window.alert('Vas a crear un calendario con '+N_PARTIDOS.n_partidos+' partidos para el equipo '+ID_EQUIPO)
    }
}