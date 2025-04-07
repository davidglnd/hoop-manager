import { Equipo } from "./classes/Equipo.js";
import { registrarUsuario } from "./script.js";
import { INITIAL_STATE, store } from './store/redux.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)

function onDOMContentLoaded(){
    let formCrearEquipo = document.getElementById('form-crear-equipo')
    let botonRoolUsuarios = document.getElementById('rol-usuarios')

    formCrearEquipo?.addEventListener('submit', datosEquipo)
    botonRoolUsuarios?.addEventListener('click', mostrarDivRol)

    leerEquipoBD()
}
function datosEquipo(event){
    event.preventDefault()

    let selectCategoria = document.getElementById('categoria')
    let inputPatrocinador = document.getElementById('patrocinador')

    let categoria = selectCategoria.value
    let patrocinador = inputPatrocinador.value
    let clubAsoc = JSON.parse(sessionStorage.getItem('club')).codigo

    añadirEquipoStore(categoria, patrocinador,clubAsoc)
}
function añadirEquipoStore(categoria,patrocinador,clubAsoc){
    let nuevoEquipo = new Equipo('',categoria, patrocinador, {}, clubAsoc)

    store.equipo.create(nuevoEquipo)
    añadirEquipo()
}
function añadirEquipo(){
    let listaEquipos = JSON.parse(localStorage.getItem('REDUX_DB') || '')

    listaEquipos.equipos = [...store.equipo.getAll()]

    localStorage.setItem('REDUX_DB', JSON.stringify(listaEquipos))
}
function leerEquipoBD(){
    let equiposAlmacenadosDB = []
    if(localStorage.getItem('REDUX_DB')){
        let equiposDB = localStorage.getItem('REDUX_DB')
        if(equiposDB === null){
            // Asignamos una cadena de texto vacía, para no romper JSON.parse()
            equiposDB = ''
        }
        equiposAlmacenadosDB = JSON.parse(equiposDB).equipos
    }else{
        localStorage.setItem('REDUX_DB', JSON.stringify(INITIAL_STATE))
    }

    equiposAlmacenadosDB.forEach(( /** @type {Equipo} */newEquipo) => {
        store.equipo.create(newEquipo)
    });

}
//TO DOfunction lanzarMensaje(){}
function mostrarDivRol(){
    //vamos a escodnder el resto de contenedores
    document.getElementById('añadir-equipo')?.classList.add('hidden')
    
    //enseñamos el contenedor en cuestion
    document.getElementById('establecer-roles')?.classList.remove('hidden')
    
    // una vez lo hemos mostrado vamos a rellenarlo
    // leemos los usuarios por codigo
    let arrayUsuarios = store.user.getAllByCodigo(JSON.parse(sessionStorage.getItem('club')).codigo)
    console.log(arrayUsuarios)
    arrayUsuarios.forEach((usuarioLista) => {
        let formulario = document.createElement('form')
        formulario.id = usuarioLista._id
        document.getElementById('establecer-roles').appendChild(formulario)

        let nombre = document.createElement('span')
        nombre.innerText = usuarioLista.name
        document.getElementById(usuarioLista._id).appendChild(nombre)

        let select = document.createElement('select')
        select.id = usuarioLista._id + '-select'
        document.getElementById(usuarioLista._id).appendChild(select)

        let optionBasico = document.createElement('option')
        optionBasico.value = 'Basico'
        optionBasico.innerText = 'Basico'
        document.getElementById(usuarioLista._id + '-select').appendChild(optionBasico)

        let optionFamiliar = document.createElement('option')
        optionFamiliar.value = 'famiiar'
        optionFamiliar.innerText = 'Familar'
        document.getElementById(usuarioLista._id + '-select').appendChild(optionFamiliar)

        let optionEntrenador = document.createElement('option')
        optionEntrenador.value = 'entrenador'
        optionEntrenador.innerText = 'Entrenador'
        document.getElementById(usuarioLista._id + '-select').appendChild(optionEntrenador)

        let botonCambio = document.createElement('button')
        botonCambio.id = usuarioLista.id + '-boton'
        botonCambio.innerText = 'Cambiar rol'
        document.getElementById(usuarioLista._id).appendChild(botonCambio)

        document.getElementById(usuarioLista._id).addEventListener('submit',(event) => cambioRol(event , usuarioLista._id, ))
    })
}

function cambioRol(event, usuario){
    event.preventDefault()
    let usuarioCambiar = store.user.getById(usuario)
    let nuevoRol = document.getElementById(usuario + '-select').value
    //creamos el usuario modificado
    let usuarioModificado = {
        ...usuarioCambiar,
        rol: nuevoRol
    }
    store.user.update(usuarioModificado)
    console.log('Cambiando rol de... ' + usuarioCambiar.name + '...Su nuevo rol es ' + usuarioModificado.rol )

    registrarUsuario()
}