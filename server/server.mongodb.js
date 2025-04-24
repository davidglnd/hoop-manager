import { MongoClient } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
  clubs: {
    count: countClubs,
    get: getClubs,
    create: createClub,

  },
  users: {
    count: countUsers,
    get: getUsers,
    create: createUser,
    logIn: loginUser,
  },
  equipos:{
    get: getEquipos,
  },
  jugadores:{
    get: getJugadores,
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

async function countClubs() {
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const clubsCollection = hoopManagerDB.collection('clubs');
    return await clubsCollection.countDocuments()
  }
// GETTERS
async function getUsers(filter){
  const client = new MongoClient(URI);
  const hoopManagerDB = client.db('Hoop-Manager');
  const usersCollection = hoopManagerDB.collection('users');
  return await usersCollection.find(filter).toArray()
}

async function getClubs(filter){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const clubsCollection = hoopManagerDB.collection('clubs');
    return await clubsCollection.find(filter).toArray()
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
// CREATES 
async function createUser(user){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const usersCollection = hoopManagerDB.collection('users');
    console.log('Usuario a crear: ',JSON.stringify(user))
    return  await usersCollection.insertOne(user);
}

async function createClub(club){
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager');
    const clubsCollection = hoopManagerDB.collection('clubs');
    console.log('Club a crear: ',JSON.stringify(club))
    return  await clubsCollection.insertOne(club);
}
// LOG IN
async function loginUser({email,password}) {
    const client = new MongoClient(URI);
    const hoopManagerDB = client.db('Hoop-Manager')
    const userCollection = hoopManagerDB.collection('users')
    
    return await userCollection.findOne({email, password}, {projection: {password: 0}})
    
}