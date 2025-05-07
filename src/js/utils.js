//@ts-check
import { INITIAL_STATE } from '../js/store/redux.js';
import { HttpError } from './classes/HttpError.js'
import { simpleFetch } from './lib/simpleFetch.js'

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)
//TO DO DISEÑAR EL HTML PARA PODER AÑADIR MAS COSAS
const TIMEOUT = 10000
export const API_PORT = location.port ? `:${1337}` : ''
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

/**
 * Calculate the category of a player based on their date of birth.
 * @param {string} fnac - The date of birth of the player in the format "yyyy-mm-dd"
 * @returns {string} The category of the player.
 */
export function calculoCategoria(fnac){
    const TEMPORADA_ACTUAL = new Date().getFullYear()
    let stringSpliced = parseInt(fnac.slice(0,4))
    let edadTemporada = TEMPORADA_ACTUAL - stringSpliced
    if(edadTemporada === 7 || edadTemporada === 8 || edadTemporada === 9) return "BENJAMIN"
    if(edadTemporada === 10 || edadTemporada === 11) return "Alevin"
    if(edadTemporada === 12 || edadTemporada === 13) return "Infantil"
    if(edadTemporada === 14 || edadTemporada === 15) return "Cadete"
    if(edadTemporada === 16 || edadTemporada === 17) return "Juvenil"
    if(edadTemporada >= 18) return "Senior"
    return "Desconocido"
}

/**
 * Returns a string representing the given date in the format "dd/mm/yyyy".
 *
 * @param {string} fecha - The date in the format "yyyy-mm-dd".
 * @returns {string} The date in the format "dd/mm/yyyy".
 */
export function fechaEstandar(fecha){
    return `${fecha.slice(8,10)}/${fecha.slice(5,7)}/${fecha.slice(0,4)}`
}