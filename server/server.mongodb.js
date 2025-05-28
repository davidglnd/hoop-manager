import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
  users: {
    count: countUsers,
    get: getUsers,
    getByClub: getUsersByClub,
    create: createUser,
    logIn: loginUser,
    update: updateUser,
  },
  equipos:{
    get: getEquipos,
    getById: getEquipoById,
    updateJugadores: updateEquiposJugadores,
    create: createEquipo
  },
  jugadores:{
    get: getJugadores,
    getById: getJugadoresById,
    updateEquipo: updateJugadoresIdEquipo,
    create: createJugador
  },
  calendario:{
    getById: getCalendario,
    getJornada: getCalendarioJornada,
    create: createCalendario,
    createConvocatoria: updateConvocatoria
  }
}
// COUNTERS
/**
 * Returns the number of users in the 'users' collection in the 'shoppingList' database.
 *
 * @returns {Promise<number>} The number of users in the collection.
 */
async function countUsers() {
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager');
  const usersCollection = hoopManagerDB.collection('users');
  return await usersCollection.countDocuments()
}

// GETTERS
async function getUsers(filter){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager');
  const usersCollection = hoopManagerDB.collection('users');
  return await usersCollection.find(filter).toArray()
}
async function getUsersByClub(filter){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager');
  const usersCollection = hoopManagerDB.collection('users');
  return await usersCollection.find(filter).toArray()
}
async function getEquipos(filter){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const equiposCollection = hoopManagerDB.collection('equipos');
    return await equiposCollection.find(filter).toArray()
}

async function getJugadores(filter){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const jugadoresCollection = hoopManagerDB.collection('jugadores');
    return await jugadoresCollection.find(filter).toArray()
}
async function getCalendarioJornada(jornada,id){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager');
  const calendarioCollection = hoopManagerDB.collection('calendario');
  
  return await calendarioCollection.findOne({ _id_equipo: id },{ projection: { partidos: { $elemMatch: { jornada: 3 } } } })

}
// CREATES 
async function createUser(user){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const usersCollection = hoopManagerDB.collection('users');
    console.log('Usuario a crear: ',JSON.stringify(user))
    return  await usersCollection.insertOne(user);
}

async function createJugador(jugador){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const jugadoresCollection = hoopManagerDB.collection('jugadores');
    return await jugadoresCollection.insertOne(jugador);
}
async function createEquipo(equipo){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const equiposCollection = hoopManagerDB.collection('equipos');
    return await equiposCollection.insertOne(equipo);
}
async function createCalendario(calendario){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager')
  const calendarioCollection = hoopManagerDB.collection('calendario')
  return await calendarioCollection.insertOne(calendario)
}
// LOG IN
async function loginUser({email,password}) {
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager')
    const userCollection = hoopManagerDB.collection('users')
    
    return await userCollection.findOne({email, password}, {projection: {password: 0}})
    
}
// UPDATES
async function updateEquiposJugadores(id,updates){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager')
  const teamCollection = hoopManagerDB.collection('equipos')

  return await teamCollection.updateOne({_id: new ObjectId(id)},{$push: {jugadores: updates} })
  
}
async function updateJugadoresIdEquipo(id,updates){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager')
  const jugadoresCollection = hoopManagerDB.collection('jugadores')

  return await jugadoresCollection.updateOne({_id: new ObjectId(id)},{$set: {_id_equipo: new ObjectId(updates)} })
  
}
async function updateUser(id,updates){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager')
  const userCollection = hoopManagerDB.collection('users')

  return await userCollection.updateOne({_id: new ObjectId(id)},{$set: updates})
}
async function updateConvocatoria(convocatoria,idEquipo){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const convocatoriaCollection = hoopManagerDB.collection('calendario');
    await convocatoriaCollection.updateOne({_id_equipo: idEquipo},{$pull: {convocatoria: {jornada: convocatoria.jornada}} })
    return await convocatoriaCollection.updateOne({_id_equipo: idEquipo},{$push: {convocatoria: convocatoria} })
}
// GET POR ID

/**
 * Returns a single jugador document from the 'jugadores' collection in the 'Hoop-Manager' database.
 *
 * @param {string} id - The id of the jugador to retrieve.
 *
 * @returns {Promise<Document>} The jugador document with the specified id.
 */
async function getJugadoresById(id){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager')
  const jugadoresCollection = hoopManagerDB.collection('jugadores')

  return await jugadoresCollection.findOne({_id: new ObjectId(id)})
}

/**
 * Returns a single equipo document from the 'equipos' collection in the 'Hoop-Manager' database.
 *
 * @param {string} id - The id of the equipo to retrieve.
 *
 * @returns {Promise<Document>} The equipo document with the specified id.
 */
async function getEquipoById(id){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager')
  const teamCollection = hoopManagerDB.collection('equipos')

  return await teamCollection.findOne({_id: new ObjectId(id)})
}

/**
 * Returns a single calendario document from the 'calendario' collection in the 'Hoop-Manager' database.
 *
 * @param {string} id - The id of the calendario to retrieve.
 *
 * @returns {Promise<Document>} The calendario document with the specified id.
 */
async function getCalendario(id){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager')
  const calendarioCollection = hoopManagerDB.collection('calendario')
  
  return await calendarioCollection.findOne({_id_equipo: id})
}

