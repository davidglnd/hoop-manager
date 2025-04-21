import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
  articles: {
    get: getArticles,
    create: createArticle,
    count: countArticles,
    update: updateArticle,
    delete: deleteArticle,
    deleteAll: deleteAllArticles
  },
  users: {
    get: getUsers,
    count: countUsers,
    logIn: logInUser,
    logOut: logoutUser
  }
}

/**
 * Returns the number of users in the 'users' collection in the 'shoppingList' database.
 *
 * @returns {Promise<number>} The number of users in the collection.
 */
async function countUsers() {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const usersCollection = shoppinglistDB.collection('users');
  return await usersCollection.countDocuments()
}

/**
 * Gets an array of users from the 'users' collection in the 'shoppingList' database.
 *
 * @returns {Promise<Array<object>>} - The array of users.
 */
async function getUsers(filter){
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const usersCollection = shoppinglistDB.collection('users');
  return await usersCollection.find(filter).toArray()
}

/**
 * Finds a user in the 'users' collection in the 'shoppingList' database given
 * an email and password.
 *
 * @param {{email: string, password: string}} data - The data to query the user.
 * @returns {Promise<object>} The user object if found, null otherwise.
 */
async function logInUser({email, password}) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const usersCollection = shoppinglistDB.collection('users');
  // TODO: update token on DB
  return await usersCollection.findOne({ email, password }, { projection: { password: 0 } })
}

/**
 * Logs out a user by setting the 'token' field to null in the 'users' collection
 * in the 'shoppingList' database.
 *
 * @param {{id: string}} data - The data to query the user.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
async function logoutUser({id}) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const usersCollection = shoppinglistDB.collection('users');
  return await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { token: null } })
}

/**
 * Creates a new article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {object} article - The article to be created.
 * @returns {Promise<object>} The created article.
 */
async function createArticle(article) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  const articleWithUserId = {
    ...article,
    user_id: new ObjectId(String(article.user_id))
  };
  const returnValue = await articlesCollection.insertOne(articleWithUserId);
  console.log('db createArticle', returnValue, article._id)
  return article
}

/**
 * Gets an array of articles from the 'articles' collection in the 'shoppingList' database.
 * The articles are filtered by the given filter.
 *
 * @param {object} [filter] - The filter to apply to the articles.
 * @param {object} [projection] - The projection to apply to the articles.
 * @returns {Promise<Array<object>>} - The array of articles.
 */
async function getArticles(filter, projection) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  return await articlesCollection.find(filter).project(projection).toArray();
}

/**
 * Returns the number of articles in the 'articles' collection in the 'shoppingList' database.
 *
 * @returns {Promise<number>} The number of articles in the collection.
 */
async function countArticles() {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  return await articlesCollection.countDocuments();
}

/**
 * Updates an article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} id - The ID of the article to be updated.
 * @param {object} updates - The fields and new values to update the article with.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
async function updateArticle(id, updates) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  const returnValue = await articlesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log('db updateArticle', returnValue, updates)
  return returnValue
}

/**
 * Deletes an article from the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} id - The ID of the article to be deleted.
 * @returns {Promise<string>} The ID of the deleted article.
 */
async function deleteArticle(id) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  const returnValue = await articlesCollection.deleteOne({ _id: new ObjectId(id) });
  console.log('db deleteArticle', returnValue, id)
  return id
}

/**
 * Deletes all articles from the 'articles' collection in the 'shoppingList' database.
 *
 * @returns {Promise<DeleteResult>} The result of the delete operation.
 */
async function deleteAllArticles() {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  const returnValue = await articlesCollection.deleteMany();
  console.log('db deleteAllArticles', returnValue)
  return returnValue
}