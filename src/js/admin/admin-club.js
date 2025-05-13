import {borradoContenedoresPerfil } from '../utils.js'

export function menuAdminClub() {
    const DIV_TABLERO = document.getElementById('tablero')

    if(DIV_TABLERO) {
        borradoContenedoresPerfil(DIV_TABLERO)
    }

    DIV_TABLERO.innerHTML = `<h2>Pagina en desarrollo..	&#128517;</h2>`


}