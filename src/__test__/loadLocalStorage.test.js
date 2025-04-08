/* eslint-disable no-undef */
import { leerUsuariosBD } from "../js/gestion-usuarios-script.js";
import users from '../api/get.users.json' with { type: 'json' }


describe('Read saved users from local storage', () => {
  beforeEach(() => {
    // Simulo lo que estaría haciendo en el navegador
    localStorage.setItem('REDUX_DB', JSON.stringify({users: users }))
    let localStoredString = localStorage.getItem('REDUX_DB')
    let localStoredData = JSON.parse(localStoredString || '')
    // y guardamos lo que tengamos en el MOCK de datos
    localStoredData.users = [...users]
    localStorage.setItem('REDUX_DB', JSON.stringify(localStoredData))
  })
  it('should get an array of users from local storage', () => {
    const data = leerUsuariosBD()

    expect(data.users).not.toBeNull()
    expect(Array.isArray(data.users)).toBe(true)
    expect(data.users.length).toBeGreaterThan(0)
  })
})