//@ts-check

/** @import { Club } from "./Club.js"*/


//patron de diseño Singleton
export class ClubDB{
    /**
     * @type {Club[] | undefined}
     */
    database
    constructor(){
    }
    /**
     * Obtiene la base de datos de clubs.
     * La base de datos es un array de objetos de tipo Club.
     * Si la base de datos no existe, se crea una base de datos vacia.
     * @returns {Club[]} - La base de datos de clubs.
     */
    get(){
        if (this.database === undefined){
            this.database = []
        }
        return this.database
    }
    /**
     * Adds one or more clubs to the database.
     * @param {...Club} clubs - One or more Club objects to add to the database.
     */
    push(){
        this.database?.push(...arguments)
    }
}