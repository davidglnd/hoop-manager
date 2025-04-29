//@ts-check
import { INITIAL_STATE } from '../js/store/redux.js';
import { HttpError } from './classes/HttpError.js'
import { simpleFetch } from './lib/simpleFetch.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)
//TO DO DISEÑAR EL HTML PARA PODER AÑADIR MAS COSAS

const TIMEOUT = 10000
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

    // if (sessionStorage.getItem('user') !== null){
    //     const USER_STORAGE = sessionStorage.getItem('user')
    //     if(USER_STORAGE){
    //         let numeroAsoc = JSON.parse(USER_STORAGE).clubAsoc//obtengo el club asociado al usario logeado
    //         //leerClubsBD()// leo los clubs de la base de datos a traves de redux.js
    
    //         let listaClubsBD =store.club.getAll()//Creo un array con los clubs de la base de datos
    
    //         // Buscamos el club asociado al usuario logeado
    //         let clubAsociado = listaClubsBD.find((/** @type {{ codigo: any; }} */ club) => club.codigo === numeroAsoc)
    //         // Pintamos el club logeado
    //         let cabezeraH1 = document.getElementById("nombre-clubReg2")
            
    //         if(cabezeraH1 ){
    //         cabezeraH1.innerText =  clubAsociado.nombre
    //         }
    //     }  
    // }else if(sessionStorage.getItem('club') !== null){
    //     const NOMBBRE_CLUB = sessionStorage.getItem('club')
    //     if(NOMBBRE_CLUB){
    //         let nombreClub = JSON.parse(NOMBBRE_CLUB).nombre //obtengo el el nombre del club
    //         let pInfoClub = document.getElementById('club-info')
    //         if(pInfoClub){
    //             pInfoClub.innerText = nombreClub
    //         }
    //     }
    // }

}
/**
 * Handles the sign-out form submission, preventing the default form behavior.
 * If a user is logged in, it removes the user session data and redirects to the home page.
 * 
 * @param {Event} event - The event object associated with the form submission.
 */
 function cerrarSesion(event){
    event.preventDefault()

    sessionStorage.removeItem('HOOP_MANAGER')
    sessionStorage.removeItem('HOOP_MANAGER_CLUB')
    location.href = '/index.html'

}
/**
 * Retrieves the shopping list data from session storage.
 *
 * @returns {import('./store/redux.js').State} Saved state.
 * If no data is found, returns an empty State object.
 */
function getDataFromSessionStorage() {
    const defaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(sessionStorage.getItem('REDUX_DB') || defaultValue)
  }

/**
 * @summary Fetches data from the given API URL with the specified method and data.
 * @description
 * This function makes an asynchronous request to the given API URL using the specified method.
 * If data is provided, it is sent as the request body. If the user is logged in, the Authorization
 * header is set to the user's token.
 * The function returns a Promise that resolves with the response data or rejects with an error.
 * If the request takes longer than the specified TIMEOUT, it is aborted. If the request fails
 * due to an AbortError, a 404 or 500 error, the function logs the error to the console.
 *
 * @param {string} apiURL - The URL to make the request to.
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method='GET'] - The HTTP method to use.
 * @param {any} [data] - The data to send as the request body.
 * @returns {Promise<any>} - The response data.
 */

export async function getAPIData(apiURL, method = 'GET', data) {
    let apiData
  
    try {
      let headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }
      // Añadimos la cabecera Authorization si el usuario esta logueado
      if (isUserLoggedIn()) {
        const userData = getDataFromSessionStorage()
        headers.append('Authorization', `Bearer ${userData?.user?.token}`)
      }
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(TIMEOUT),
        method: method,
        body: data ?? undefined,
        headers: headers
      });
    } catch (/** @type {any | HttpError} */err) {
      // En caso de error, controlamos según el tipo de error
      if (err.name === 'AbortError') {
        console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          console.error('Not found');
        }
        if (err.response.status === 500) {
          console.error('Internal server error');
        }
      }
    }
  
    return apiData
  }
/**
 * Checks if there is a user logged in by verifying the presence of a token
 * in the local storage.
 *
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
function isUserLoggedIn() {
    const userData = getDataFromSessionStorage()
    return userData?.user?.token
}

