//@ts-check
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
    let formularioLogOut = document.getElementById('cerrar-sesion')
    formularioLogOut?.addEventListener('click', cerrarSesion)

    if (sessionStorage.getItem('user') !== null){
        const USER_STORAGE = sessionStorage.getItem('user')
        if(USER_STORAGE){
            let numeroAsoc = JSON.parse(USER_STORAGE).clubAsoc//obtengo el club asociado al usario logeado
            leerClubsBD()// leo los clubs de la base de datos a traves de redux.js
    
            let listaClubsBD =store.club.getAll()//Creo un array con los clubs de la base de datos
    
            // Buscamos el club asociado al usuario logeado
            let clubAsociado = listaClubsBD.find((/** @type {{ codigo: any; }} */ club) => club.codigo === numeroAsoc)
            // Pintamos el club logeado
            let cabezeraH1 = document.getElementById("nombre-clubReg2")
            
            if(cabezeraH1 ){
            cabezeraH1.innerText =  clubAsociado.nombre
            }
        }  
    }else if(sessionStorage.getItem('club') !== null){
        const NOMBBRE_CLUB = sessionStorage.getItem('club')
        if(NOMBBRE_CLUB){
            let nombreClub = JSON.parse(NOMBBRE_CLUB).nombre //obtengo el el nombre del club
            let pInfoClub = document.getElementById('club-info')
            if(pInfoClub){
                pInfoClub.innerText = nombreClub
            }
        }
    }

}
/**
 * Handles the sign-out form submission, preventing the default form behavior.
 * If a user is logged in, it removes the user session data and redirects to the home page.
 * 
 * @param {Event} event - The event object associated with the form submission.
 */
 function cerrarSesion(event){
    event.preventDefault()

    sessionStorage.removeItem('user')
    sessionStorage.removeItem('club')
    location.href = '/index.html'

}
