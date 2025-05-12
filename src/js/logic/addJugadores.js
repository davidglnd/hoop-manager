//@ts-check
/* eslint-disable @typescript-eslint/no-unused-vars */
/*Lo usamos porque estamos simulando la subida de archivos*/
import {Jugador} from "../classes/Jugador.js"
import { calculoCategoria } from "../utils.js"
import {getAPIData, API_PORT} from "../utils.js"

/**
 * Handles the submission of the "Anadir jugador" form.
 * Prevents the default form submission, retrieves the values of the form
 * and sends a POST request to the server with the player data.
 * The function uses the provided parameters to obtain the logged-in user's
 * information from session storage.
 * The function creates a new `Jugador` object with the provided data and
 * calls the `addJugadorBBDD` function to add the player to the database.
 * @param {Event} e - The event that triggered this function.
 */
export function datosJugadores(e){
    e.preventDefault()
    
    const nombre = /** @type {HTMLInputElement} */(document.getElementById('nombre'))?.value
    const apellidos = /** @type {HTMLInputElement} */(document.getElementById('apellidos'))?.value
    const sexo = /** @type {HTMLInputElement} */(document.getElementById('sexo'))?.value
    const fechaNacimiento = /** @type {HTMLInputElement} */(document.getElementById('fecha-nacimiento'))?.value
    const direccion = /** @type {HTMLInputElement} */(document.getElementById('direccion'))?.value
    const fotoJugador = "ruta foto jugador"
    const dniFrontal = "ruta dni frontal"
    const dniTrasero = "ruta dni trasero"
    const documentoExtra = "ruta documento extra"
    /*Simulamos la subida de archivos*/

    /*Tomamos los datos del usuario que esta creando el jugador para que jugador herede alguno de esos datos(id familiar clubasoc telefono etc)*/ 
    let usuarioLog = JSON.parse(sessionStorage.getItem('HOOP_MANAGER') || '') 
    
    let jugador = new Jugador(usuarioLog._id,nombre,apellidos,fechaNacimiento,sexo,direccion,usuarioLog.clubAsoc,'',calculoCategoria(fechaNacimiento),usuarioLog.email,usuarioLog.nTelefono)

    addJugadorBBDD(jugador)

}

/**
 * Adds a new player to the database.
 * @param {Jugador} jugador - The player to be added.
 */

async function addJugadorBBDD(jugador) {
    await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/jugador`, 'POST', JSON.stringify(jugador) )
}