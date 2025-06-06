// @ts-check
/** @import { User } from '../classes/User.js' */
/** @import { Club } from '../classes/Club.js' */
/** @import { Equipo } from '../classes/Equipo.js' */
/** @import { Jugador } from '../classes/Jugador.js' */
/**
 * @module redux/store
 */
/**
 * @typedef {Object.<(string), any>} State
 * @property {Array [] | []} users
 * @property {Array [] | []} clubs
 * @property {Array [] | []} equipos
 * @property {Array [] | []} jugadores
 * @property {boolean} isLoading
 * @property {boolean} error
 */
/**
 * @type {State}
 */
export const INITIAL_STATE = {
  users: [],
  clubs: [],
  equipos: [],
  jugadores:[],
  isLoading: false,// Podría usarse para controlar cuando estamos realizando un fetch
  error: false,// Podría usarse para controlar cuando sucede un error
}
/**
 * @typedef {Object} ActionTypeUser
 * @property {string} type
 * @property {User} [user]
 * @typedef {Object} ActionTypeClub
 * @property {string} type
 * @property {Club} [club]
 * @typedef {Object} ActionTypeEquipos
 * @property {string} type
 * @property {Equipo} [equipo]
 * @typedef {Object} ActionTypeJugadores
 * @property {string} type
 * @property {Jugador} [jugador]
 */

const ACTION_TYPES = {
  // CRUD
  // User
  CREATE_USER: 'CREATE_USER',
  READ_LIST: 'READ_LIST',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  DELETE_ALL_USERS: 'DELETE_ALL_USERS',
  // Club
  CREATE_CLUB: 'CREATE_CLUB',
  READ_LIST_CLUBS: 'READ_LIST_CLUBS',
  UPDATE_CLUB: 'UPDATE_CLUB',
  DELETE_CLUB: 'DELETE_CLUB',
  DELETE_ALL_CLUBS: 'DELETE_ALL_CLUBS',
  //equipo
  CREATE_EQUIPO: 'CREATE_EQUIPO',
  READ_LIST_EQUIPOS: 'READ_LIST_EQUIPOS',
  UPDATE_EQUIPO: 'UPDATE_EQUIPO',
  DELETE_EQUIPO: 'DELETE_EQUIPO',
  DELETE_ALL_EQUIPOS: 'DELETE_ALL_EQUIPOS',
  //jugador
  CREATE_JUGADOR: 'CREATE_JUGADOR',
  READ_LIST_JUGADORES: 'READ_LIST_JUGADORES',
  UPDATE_JUGADOR: 'UPDATE_JUGADOR',
  DELETE_JUGADOR: 'DELETE_JUGADOR',
  DELETE_ALL_JUGADORES: 'DELETE_ALL_JUGADORES',
}

/**
 * Reducer for the app state.
 *
 * @param {State} state - The current state
 * @param {ActionTypeUser} action - The action to reduce
 * @param {ActionTypeClub} action - The action to reduce
 * @param {ActionTypeEquipos} action - The action to reduce
 * @param {ActionTypeJugadores} action - The action to reduce
 * @returns {State} The new state
 */
const appReducer = (state = INITIAL_STATE, action) => {
  const actionWithUser = /** @type {ActionTypeUser} */(action)
  const actionWithClub = /** @type {ActionTypeClub} */(action)
  const actionWithEquipo = /** @type {ActionTypeEquipos} */(action)
  const actionWithJugador = /** @type {ActionTypeJugadores} */(action)
  switch (action.type) {
    case ACTION_TYPES.CREATE_USER:
      return {
        ...state,
        users: [
          ...state.users,
          actionWithUser.user
        ]
      };
    case ACTION_TYPES.READ_LIST:
      return {...state};
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((/** @type {User} */user) => {
          if (user._id === actionWithUser?.user?._id) {
            return actionWithUser.user
          }
          return user
        })
      };
    case ACTION_TYPES.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((/** @type {User} */user) => user._id !== actionWithUser?.user?._id)
      };
    case ACTION_TYPES.DELETE_ALL_USERS:
      return {
        ...state,
        users: []
      };
    case ACTION_TYPES.CREATE_CLUB:
      return {
        ...state,
        clubs: [
          ...state.clubs,
          actionWithClub.club
        ]
      };
    case ACTION_TYPES.READ_LIST_CLUBS:
      return {...state};
    case ACTION_TYPES.UPDATE_CLUB:
      return {
        ...state,
        clubs: state.clubs.map((/** @type {Club} */club) => {
          if (club._id === actionWithClub?.club?._id) {
            return actionWithClub.club
          }
          return club
        })
      };
    case ACTION_TYPES.DELETE_CLUB:
      return {
        ...state,
        clubs: state.clubs.filter((/** @type {Club} */club) => club._id !== actionWithClub?.club?._id)
      };
    case ACTION_TYPES.DELETE_ALL_CLUBS:
      return {
        ...state,
        clubs: []
      };
    case ACTION_TYPES.CREATE_EQUIPO:
      return {
        ...state,
        equipos: [
          ...state.equipos,
          actionWithEquipo.equipo
        ]
      };
    case ACTION_TYPES.READ_LIST_EQUIPOS:
      return {...state};
    case ACTION_TYPES.UPDATE_EQUIPO:
      return {
        ...state,
        equipos: state.equipos.map((/** @type {Equipo} */equipo) => {
          if (equipo._id === actionWithEquipo?.equipo?._id) {
            return actionWithEquipo.equipo
          }
          return equipo
        })
      };
    case ACTION_TYPES.DELETE_EQUIPO:
      return {
        ...state,
        equipos: state.equipos.filter((/** @type {Equipo} */equipo) => equipo._id !== actionWithEquipo?.equipo?._id)
      };
    case ACTION_TYPES.DELETE_ALL_EQUIPOS:
      return {
        ...state,
        equipos: []
      };
    case ACTION_TYPES.CREATE_JUGADOR:
      return {
        ...state,
        jugadores: [
          ...state.jugadores,
          actionWithJugador.jugador
        ]
      };
    case ACTION_TYPES.READ_LIST_JUGADORES:
      return {...state};
    case ACTION_TYPES.UPDATE_JUGADOR:
      return {
        ...state,
        jugadores: state.jugadores.map((/** @type {Jugador} */jugador) => {
          if (jugador._id === actionWithJugador?.jugador?._id) {
            return actionWithJugador.jugador
          }
          return jugador
        })
      };
    case ACTION_TYPES.DELETE_JUGADOR:
      return {
        ...state,
        jugadores: state.jugadores.filter((/** @type {Jugador} */jugador) => jugador._id !== actionWithJugador?.jugador?._id)
      };
    case ACTION_TYPES.DELETE_ALL_JUGADORES:
      return {
        ...state,
        jugadores: []
      };
  }
}
/**
 * @typedef {Object} PublicMethods
 * @property {function} create
 * @property {function} read
 * @property {function} update
 * @property {function} delete
 * @property {function} [getById]
 * @property {function} getAll
 * @property {function} [deleteAll]
 * @property {function} [getByEmail]
 * @property {function} [getAllByCodigo]
 */
/**
 * @typedef {Object} Store
 * @property {PublicMethods} user
 * @property {PublicMethods} club
 * @property {PublicMethods} equipo
 * @property {PublicMethods} jugador
 * @property {function} getState
 */
/**
 * Creates the store singleton.
 * @param {appReducer} reducer
 * @returns {Store}
 */
const createStore = (reducer) => {
  let currentState = INITIAL_STATE
  let currentReducer = reducer

  // Private methods
  /**
   *
   * @param {ActionTypeUser | ActionTypeClub | ActionTypeEquipos | ActionTypeJugadores} action
   * @param {function | undefined} [onEventDispatched]
   */
  const _dispatch = (action, onEventDispatched) => {
    let previousValue = currentState;
    let currentValue = currentReducer(currentState, action);
    currentState = currentValue;

    window.dispatchEvent(new CustomEvent('stateChanged', {
        detail: {
          type: action.type,
          changes: _getDifferences(previousValue, currentValue)
        },
        cancelable: true,
        composed: true,
        bubbles: true
    }));
    if (onEventDispatched) {
      // console.log('onEventDispatched', onEventDispatched);
      onEventDispatched();
      // onEventDispatched.call(this, {
      //   type: action.type,
      //   changes: _getDifferences(previousValue, currentValue)
      // })
    }
  }
  /**
   * Returns a new object with the differences between the `previousValue` and
   * `currentValue` objects. It's used to create a payload for the "stateChanged"
   * event, which is dispatched by the store every time it changes.
   *
   * @param {State} previousValue - The old state of the store.
   * @param {State} currentValue - The new state of the store.
   * @returns {Object} - A new object with the differences between the two
   *     arguments.
   * @private
   */
  const _getDifferences = (previousValue, currentValue) => {
    return Object.keys(currentValue).reduce((diff, key) => {
        if (previousValue[key] === currentValue[key]) return diff
        return {
            ...diff,
            [key]: currentValue[key]
        };
    }, {});
  }

  // Actions User
  /**
   * Creates a new Article inside the store
   * @param {User} user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const createUser = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_USER, user }, onEventDispatched);
  /**
   * Reads the list of articles
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const readListUser = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.READ_LIST }, onEventDispatched);
  /**
   * Updates an article
   * @param {User} user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const updateUser = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.UPDATE_USER, user }, onEventDispatched);
  /**
   * Deletes an article
   * @param {User} user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const deleteUser = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_USER, user }, onEventDispatched);

  /**
   * Deletes all the articles
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   * */
  const deleteAllUsers = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_ALL_USERS }, onEventDispatched);
  //Actions Club
  /**
   * Creates a new Article inside the store
   * @param {Club} club
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const createClub = (club,  onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_CLUB, club }, onEventDispatched);
  /**
   * Reads the list of equipos
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const readListClub = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.READ_LIST_CLUBS }, onEventDispatched);
  /**
   * Updates a club
   * @param {Club} club - The club to update
   * @param {function | undefined} [onEventDispatched] - A callback function that
   *     will be called when the state changes are dispatched.
   * @returns void
   */
  const updateClub = (club, onEventDispatched) => _dispatch({ type: ACTION_TYPES.UPDATE_USER, club }, onEventDispatched);
  /**
   * Deletes a club
   * @param {Club} club 
   * @param {function | undefined} [onEventDispatched]
   * @returns 
   */
  const deleteClub = (club, onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_CLUB, club }, onEventDispatched);
  /**
   * Deletes all the clubs
   * @param {function | undefined} [onEventDispatched]
   */
  const deleteAllClubs = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_ALL_CLUBS}, onEventDispatched);
  // Getters User
  /**
   * Returns the article with the specified id
   * @param {string} id
   * @returns {User | undefined}
   */
  const getUserById = (id) => { return currentState.users.find((/** @type {User} */user) => user._id === id) };
  /**
   * Returns the article with the specified email
   * @param {string} email
   * @returns {User | undefined}
   */
  const getUserByEmail = (email) => { return currentState.users.find((/** @type {User} */user) => user.email === email) };
  /**
   * Returns all the articles
   * @returns {Array<User>}
   */
  const getAllUsers = () => { return currentState.users };

  const getAllUserby = (/** @type {any} */ clubAsoc) => {return currentState.users.filter((/** @type {{ clubAsoc: any; }} */ user) => user.clubAsoc === clubAsoc)}
  // Getters Club
   /**
   * Returns the clb with the specified id
   * @param {string} codigo
   * @returns {Club | undefined}
   */
  const getClubById = (codigo) => { return currentState.clubs.find((/** @type {Club} */club) => club.codigo === codigo) };
    /**
   * Returns the club with the specified email
   * @param {string} email
   * @returns {Club | undefined}
   */
  const getClubByEmail = (email) => { return currentState.clubs.find((/** @type {Club} */club) => club.email === email) };
  /**
   * Returns all the clubs
   * @returns {Array<Club>}
   */
  const getAllClubs = () => { return currentState.clubs };
  //Actions Equipo
    /**
   * Creates a new Equipo inside the store
   * @param {Equipo} equipo
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const createEquipo = (equipo,  onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_EQUIPO, equipo }, onEventDispatched);
    /**
   * Reads the list of equipos
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const readListEquipos = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.READ_LIST_EQUIPOS }, onEventDispatched);
    /**
   * Updates a club
   * @param {Equipo} equipo - The club to update
   * @param {function | undefined} [onEventDispatched] - A callback function that
   *     will be called when the state changes are dispatched.
   * @returns void
   */
  const updateEquipo = (equipo, onEventDispatched) => _dispatch({ type: ACTION_TYPES.UPDATE_USER, equipo }, onEventDispatched);
      /**
   * Deletes a equipo
   * @param {Equipo} equipo 
   * @param {function | undefined} [onEventDispatched]
   * @returns 
   */
  const deleteEquipo = (equipo, onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_EQUIPO, equipo }, onEventDispatched);
   /**
   * Deletes all the clubs
   * @param {function | undefined} [onEventDispatched]
   */
  const deleteAllEquipos = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_ALL_EQUIPOS}, onEventDispatched);
  //Getters equipo
  const getEquipoById = (/** @type {string} */ id) => { return currentState.equipos.find((/** @type {Equipo} */equipo) => equipo._id === id) };
  /**
   * Returns all the clubs
   * @returns {Array<Equipo>}
   */
  const getAllEquipo = () => {return currentState.equipos}
  //Actions jugador
  /**
   * Creates a new Equipo inside the store
   * @param {Jugador} jugador
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const createJugador = (jugador, onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_JUGADOR, jugador }, onEventDispatched);
  /**
   * Reads the list of articles
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const readListjugadores = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.READ_LIST_JUGADORES }, onEventDispatched);
  /**
   * Updates a club
   * @param {Jugador} jugador - The club to update
   * @param {function | undefined} [onEventDispatched] - A callback function that
   *     will be called when the state changes are dispatched.
   * @returns void
   */
  const updateJugador = (jugador, onEventDispatched) => _dispatch({ type: ACTION_TYPES.UPDATE_JUGADOR, jugador }, onEventDispatched);
    /**
   * Updates a club
   * @param {Jugador} jugador - The club to update
   * @param {function | undefined} [onEventDispatched] - A callback function that
   *     will be called when the state changes are dispatched.
   * @returns void
   */
  const deleteJugador = (jugador, onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_JUGADOR, jugador }, onEventDispatched);
     /**
   * Deletes all the clubs
   * @param {function | undefined} [onEventDispatched]
   */
    const deleteAllJugadores = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_ALL_JUGADORES}, onEventDispatched);
  //getter jugador
  const getAllJugadores = () => {return currentState.jugadores}
  // Public methods
  /**
   *
   * @returns {State}
   */
  const getState = () => { return currentState };

  // Namespaced actions
  /** @type {PublicMethods} */
  const user = {
    create: createUser,
    read: readListUser,
    update: updateUser,
    delete: deleteUser,
    getById: getUserById,
    getByEmail: getUserByEmail,
    getAll: getAllUsers,
    deleteAll: deleteAllUsers,
    getAllByCodigo: getAllUserby
  }
  const club = {
    create: createClub,
    read: readListClub,
    update: updateClub,
    delete: deleteClub,
    getById: getClubById,
    getByEmail: getClubByEmail,
    getAll: getAllClubs,
    deleteAll: deleteAllClubs
  }
  const equipo = {
    create: createEquipo,
    read: readListEquipos,
    update: updateEquipo,
    delete: deleteEquipo,
    getById: getEquipoById,
    getAll: getAllEquipo,
    deleteAll: deleteAllEquipos
  }
  const jugador = {
    create: createJugador,
    read: readListjugadores,
    update: updateJugador,
    delete: deleteJugador,
    getAll: getAllJugadores,
    deleteAll: deleteAllJugadores
  }
  return {
    // Actions
    user,
    club,
    equipo,
    jugador,
    // Public methods
    getState
  }
}

// Export store
export const store = createStore(appReducer)