//@ts-check
import { getAPIData, API_PORT,borradoContenedoresPerfil } from '../utils.js'


/**
 * Muestra un menu en el contenedor con id 'opciones' que 
 * permite al administrador filtrar los usuarios por rol.
 * 
 * @param {Object} usuarioLogeado - El usuario logeado.
 * @param {string} usuarioLogeado.rol - El rol del usuario logeado.
 */
export function menu(usuarioLogeado){
    const OPCIONES = document.getElementById('opciones')

    const P_USUARIOS_SIN_ROL = document.createElement('p')
    P_USUARIOS_SIN_ROL.id = 'p-usuarios-sin-rol'
    P_USUARIOS_SIN_ROL.textContent = 'Usuarios sin rol asignado'
    OPCIONES?.appendChild(P_USUARIOS_SIN_ROL)

    const P_USUARIOS_ENTRENADORES = document.createElement('p')
    P_USUARIOS_ENTRENADORES.id = 'p-usuarios-entrenadores'
    P_USUARIOS_ENTRENADORES.textContent = 'Usuarios entrenadores'
    OPCIONES?.appendChild(P_USUARIOS_ENTRENADORES)

    const P_USUARIOS_FAMILIARES = document.createElement('p')
    P_USUARIOS_FAMILIARES.id = 'p-usuarios-familiares'
    P_USUARIOS_FAMILIARES.textContent = 'Usuarios familiares'
    OPCIONES?.appendChild(P_USUARIOS_FAMILIARES)

    

    // @ts-expect-error arreglar estos errores
    P_USUARIOS_SIN_ROL.addEventListener('click',() => mostrarUsuarios(usuarioLogeado,'ESTANDAR'))
    // @ts-expect-error arreglar estos errores
    P_USUARIOS_ENTRENADORES.addEventListener('click',() => mostrarUsuarios(usuarioLogeado,'entrenador'))
    // @ts-expect-error arreglar estos errores
    P_USUARIOS_FAMILIARES.addEventListener('click',() => mostrarUsuarios(usuarioLogeado,'familiar'))
}

/**
 * Fetches and displays a list of users with a specified role within a table format.
 * Clears the previous content in the 'listas-usuarios' container and populates it with 
 * a new table containing user information such as name, surname, email, and role.
 * Provides options to assign a new role to each user and update their role.
 *
 * @param {Object} usuarioLogeado - The currently logged-in user object.
 * @param {string} usuarioLogeado.codigo - The code associated with the logged-in user's club.
 * @param {string} rol - The role of the users to be displayed (e.g., 'ESTANDAR', 'entrenador', 'familiar').
 */

async function mostrarUsuarios(usuarioLogeado,rol) {
    const DIV_LISTAS = document.getElementById('listas-usuarios')

    if (DIV_LISTAS) {
        borradoContenedoresPerfil(DIV_LISTAS);

    } else {
        return
    }
    
    const USUARIOS = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/users/${usuarioLogeado.codigo}`, 'GET')
    console.log(USUARIOS)

    const TABLA = document.createElement('table')
    TABLA.id = 'tabla-usuarios'

    const CAPTION = document.createElement('caption')

    if(rol === 'ESTANDAR'){
        CAPTION.textContent = 'Usuarios sin rol asignado'
    }else if (rol === 'entrenador'){
        CAPTION.textContent = 'Usuarios entrenadores'
    }else if (rol === 'familiar'){
        CAPTION.textContent = 'Usuarios familiares'
    }

    
    TABLA.appendChild(CAPTION)

    const THEAD = document.createElement('thead')
    THEAD.innerHTML = `<tr><th>Nombre</th><th>Apellidos</th><th>Correo</th><th>Rol</th><th>Asignar rol</th><th></th></tr>`
    
    const TBODY = document.createElement('tbody')

    TABLA.appendChild(THEAD)
    TABLA.appendChild(TBODY)
    DIV_LISTAS.appendChild(TABLA)

    USUARIOS.forEach((/** @type {{ rol: string; nombre: any; apellidos: any; email: any; _id: any; }} */ usuario) => {
        if(usuario.rol === rol){
            const TR = document.createElement('tr')
            TR.innerHTML = `<td>${usuario.nombre}</td><td>${usuario.apellidos}</td><td>${usuario.email}</td><td>${usuario.rol.toUpperCase()}</td>
            <td><select id="asignar-rol-${usuario._id}"><option value="" selected disabled>Asigne nuevo rol</option>
            <option value="entrenador">Entrenador</option><option value="familiar">Familiar</option><option value="ESTANDAR">Usuario basico</option></select></td>
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



