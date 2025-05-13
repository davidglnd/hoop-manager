//@ts-check
import { getAPIData, API_PORT,borradoContenedoresPerfil } from '../utils.js'


/**
 * Muestra un menu con opciones para filtrar a los usuarios
 * segun su rol
 * @param {object} usuarioLogeado - El usuario logeado
 * @returns {Promise<Object[]>} - Retorna un array de usuarios
 */
export async function menu(usuarioLogeado){
    // @ts-expect-error Arreglar esto
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/users/${usuarioLogeado.codigo}`, 'GET')

    const DIV_OPCIONES = document.getElementById('opciones')

    if(DIV_OPCIONES) {
        borradoContenedoresPerfil(DIV_OPCIONES)
    }
    const MENU_FILTROS = document.createElement('lit-admin-filter-bar')
    MENU_FILTROS.setAttribute('opciones', JSON.stringify(['Usuarios sin rol asignado', 'Usuarios entrenadores', 'Usuarios familiares']))
    DIV_OPCIONES?.appendChild(MENU_FILTROS)

    return apiData
}

/**
 * Muestra una tabla con los usuarios segun el rol seleccionado.
 * 
 * @param {CustomEvent} e - Evento que contiene la opcion seleccionada.
 * @param {Array<[Object]>} usuarios - Array de objetos con los usuarios.
 * @returns {void}
 */
export function mostrarUsuariosAdmin(e,usuarios) {
    const DIV_LISTAS = document.getElementById('listas-usuarios')

    if (DIV_LISTAS) {
        borradoContenedoresPerfil(DIV_LISTAS);

    } else {
        return
    }

    const TABLA = document.createElement('table')
    TABLA.id = 'tabla-usuarios'

    const CAPTION = document.createElement('caption')
    
    let rol = null

    if(e.detail.opcion === 'Usuarios sin rol asignado'){
        CAPTION.textContent = 'Usuarios sin rol asignado'
        rol = 'ESTANDAR'
    }else if (e.detail.opcion === 'Usuarios entrenadores'){
        CAPTION.textContent = 'Usuarios entrenadores'
        rol = 'entrenador'
    }else if (e.detail.opcion === 'Usuarios familiares'){
        CAPTION.textContent = 'Usuarios familiares'
        rol = 'familiar'
    }

    
    TABLA.appendChild(CAPTION)

    const THEAD = document.createElement('thead')
    THEAD.innerHTML = `<tr><th>Nombre</th><th>Apellidos</th><th>Correo</th><th>Rol</th><th>Asignar rol</th><th></th></tr>`
    
    const TBODY = document.createElement('tbody')

    TABLA.appendChild(THEAD)
    TABLA.appendChild(TBODY)
    DIV_LISTAS.appendChild(TABLA)

    usuarios.forEach((usuario) => {

        if('rol' in usuario && '_id' in usuario && 'nombre' in usuario && 'apellidos' in usuario && 'email' in usuario && typeof usuario.rol === 'string' && typeof usuario._id === 'string' && typeof usuario.nombre === 'string' && typeof usuario.apellidos === 'string' && typeof usuario.email === 'string'){
            if(usuario.rol === rol){
            const TR = document.createElement('tr')
            TR.innerHTML = `<td>${usuario.nombre}</td><td>${usuario.apellidos}</td><td>${usuario.email}</td><td>${usuario.rol.toUpperCase()}</td>
            <td><select id="asignar-rol-${usuario._id}">
            <option value="" selected disabled>Asigne nuevo rol</option>
            <option value="entrenador">Entrenador</option>
            <option value="familiar">Familiar</option>
            <option value="ESTANDAR">Usuario basico</option>
            </select></td>
            <td class="actualizar-rol-disabled" id="${usuario._id}">Actualizar rol</td>
            `
            TBODY.appendChild(TR)
            // @ts-expect-error arreglar estos errores
            document.getElementById(`asignar-rol-${usuario._id}`).addEventListener('change', () =>{
                // @ts-expect-error arreglar estos errores
                if(document.getElementById(`asignar-rol-${usuario._id}`).value !== usuario.rol){
                    // @ts-expect-error arreglar estos errores
                    document.getElementById(`${usuario._id}`).className = 'actualizar-rol'
                }else{
                    return
                }} 
                
            )
            // @ts-expect-error arreglar estos errores
            document.getElementById(`${usuario._id}`).addEventListener('click', () => cambioRol(usuario._id,usuario.nombre,usuario.rol))
        }
        }
        
    });


}

/**
 * Updates the user's role by making a PUT request to the API with the new role.
 * Retrieves the new role from the select element associated with the user's ID.
 * Logs the API response and sends a message about the role change.
 *
 * @param {string} id - The ID of the user whose role is being changed.
 * @param {string} nombre - The name of the user whose role is being changed.
 * @param {string} rolAntiguo - The previous role of the user.
 */

async function cambioRol(id,nombre,rolAntiguo){
    // @ts-expect-error arreglar estos errores
    const NUEVO_ROL = document.getElementById(`asignar-rol-${id}`).value
    
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/user/${id}`,'PUT',JSON.stringify({rol : NUEVO_ROL}))
    console.log(apiData)

    enviarMensaje(nombre,rolAntiguo,NUEVO_ROL)
}


/**
 * Displays a temporary message indicating the user's role change.
 * Creates a paragraph element with a message about the change from the old role to the new role.
 * Appends the message to the 'mensajes' container and removes it after 2 seconds.
 * Also reloads the page after the message is removed.
 *
 * @param {string} nombre - The name of the user whose role has changed.
 * @param {string} rolAntiguo - The user's previous role.
 * @param {string} rolNuevo - The user's new role.
 */

function enviarMensaje(nombre,rolAntiguo,rolNuevo){
    const MENSAJE = document.createElement('p')

    if(MENSAJE){
        MENSAJE.textContent = `${nombre} su rol ha cambiado de ${rolAntiguo} a ${rolNuevo}`
    }
    
    const DIV_MENSAJES = document.getElementById('mensajes')
    
    if(DIV_MENSAJES){
        DIV_MENSAJES.appendChild(MENSAJE)
    }

    setTimeout(() => {
        MENSAJE.remove()
        location.reload()
    }, 2000);
}



