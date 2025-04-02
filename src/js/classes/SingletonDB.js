//@ts-check

/** @import { User } from "./User.js"*/


//patron de diseño Singleton
export class SingletonDB{
    /**
     * @type {any[] | undefined}
     */
    usuariosDB
    constructor(){
    }
    /**
     * Obtiene la base de datos de usuarios.
     * La base de datos es un array de objetos de tipo User.
     * Si la base de datos no existe, se crea una base de datos vacia.
     * @returns {User[]} - La base de datos de usuarios.
     */
    get(){
        if (this.usuariosDB === undefined){
            this.usuariosDB = []
        }
        return this.usuariosDB
    }
        /**
     * Agrega uno o mas usuarios a la base de datos.
     * @param  {...User} usuarios - Uno o mas objetos de tipo User
     */
    push(){
        this.usuariosDB?.push(...arguments)
    }
    /**
     * Borra un usuario de la base de datos.
     * @param {string} email - Email del usuario a borrar.
     */
    borrarUsuario(email){
        this.usuariosDB?.splice(this.usuariosDB.findIndex((user) => user.email === email), 1)
    }
}