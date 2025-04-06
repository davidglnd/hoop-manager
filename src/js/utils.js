import { store } from '../js/store/redux.js';
import { leerClubsBD } from '../js/script.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)
//TO DO DISEÑAR EL HTML PARA PODER AÑADIR MAS COSAS
function onDOMContentLoaded() {
    let numeroAsoc = JSON.parse(sessionStorage.getItem('user')).clubAsoc //obtengo el club asociado al usario logeado
    
    leerClubsBD()// leo los clubs de la base de datos a traves de redux.js

    let listaClubsBD =store.club.getAll()//Creo un array con los clubs de la base de datos
    // Buscamos el club asociado al usuario logeado
    let clubAsociado = listaClubsBD.find((club) => club.codigo === numeroAsoc)
    
    // Pintamos el club logeado
    let cabezeraTitle = document.getElementById("nombre-clubReg1")
    let cabezeraH1 = document.getElementById("nombre-clubReg2")

    cabezeraTitle.innerText =  clubAsociado.siglas + ' ' +numeroAsoc
    cabezeraH1.innerText =  clubAsociado.nombre
}
