import { store } from '../js/store/redux.js';
import { leerClubsBD } from './gestion-usuarios-script.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)
//TO DO DISEÑAR EL HTML PARA PODER AÑADIR MAS COSAS

/**
 * Funcion que se ejecuta cuando se termina de cargar la pagina.
 * Comprueba si hay un usuario logeado en la sesion, si es asi, 
 * obtiene el club asociado y lo pinta en la cabecera de la pagina.
 * Si no hay un usuario logeado, pero si hay un club logeado, 
 * pinta el nombre y el codigo del club en la cabecera de la pagina.
 */
function onDOMContentLoaded() {

    if (sessionStorage.getItem('user') !== null){
        let numeroAsoc = JSON.parse(sessionStorage.getItem('user')).clubAsoc //obtengo el club asociado al usario logeado
    
    
        leerClubsBD()// leo los clubs de la base de datos a traves de redux.js
    
        let listaClubsBD =store.club.getAll()//Creo un array con los clubs de la base de datos
        // Buscamos el club asociado al usuario logeado
        let clubAsociado = listaClubsBD.find((/** @type {{ codigo: any; }} */ club) => club.codigo === numeroAsoc)
        
        // Pintamos el club logeado
        let cabezeraTitle = document.getElementById("nombre-clubReg1")
        let cabezeraH1 = document.getElementById("nombre-clubReg2")
    
        cabezeraTitle.innerText =  clubAsociado.siglas + ' ' +numeroAsoc
        cabezeraH1.innerText =  clubAsociado.nombre

    }else if(sessionStorage.getItem('club') !== null){
        let nombreClub = JSON.parse(sessionStorage.getItem('club')).nombre //obtengo el el nombre del club
        
        let pInfoClub = document.getElementById('club-info')

        pInfoClub.innerText = nombreClub

    }

}
