import express from 'express';
import bodyParser from 'body-parser';
import { db } from "./server.mongodb.js";
import { gooogleOauth2 } from './server.oauth.js';

const app = express();
const port = process.env.PORT;

// Static server
app.use(express.static('src'));
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/check/:nombre', async (req, res) => {
  const usuarios = await db.users.count()
  res.send(`Hola ${req.params.nombre}, hay ${usuarios} usuarios`)
})
// CRUD
app.post('/api/create/articles', requireAuth, async (req, res) => {
  res.json(await db.articles.create(req.body))
})
app.get('/api/read/articles', async (req, res) => {
  // res.json(await db.articles.get({}, { _id: 0, qty: 1 }))
  res.json(await db.articles.get())
})
app.get('/api/filter/articles/:name', async (req, res) => {
  res.json(await db.articles.get({ $text: { $search: req.params.name } }))
})
app.put('/api/update/articles/:id', requireAuth, async (req, res) => {
  res.json(await db.articles.update(req.params.id, req.body))
})
app.delete('/api/delete/articles/:id', requireAuth, async (req, res) => {
  res.json(await db.articles.delete(req.params.id))
})
app.delete('/api/delete/all/articles/', requireAuth, async (req, res) => {
  res.json(await db.articles.deleteAll())
})
app.get('/api/read/users', async (req, res) => {
  res.json(await db.users.get())
})
app.get('/api/filter/users/:name', async (req, res) => {
  // TODO: ver parámetros de búsqueda
  // https://www.mongodb.com/docs/manual/reference/operator/query/
  res.json(await db.articles.get({ $text: { $search: req.params.name } }))
})
app.post('/api/login', async (req, res) => {
  // TODO: update token on DB
  const user = await db.users.logIn(req.body)
  if (user) {
    // TODO: use OAuth2
    // ...
    // Simulation of authentication (OAuth2)
    user.token = gooogleOauth2()
    // Remove password
    // delete user.password
    res.json(user)
  } else {
    // Unauthorized
    res.status(401).send('Unauthorized')
  }
})
app.get('/api/logout/:id', async (req, res) => {
  const response = await db.users.logOut(req.params.id)
  console.log('logOut', response)
  res.status(200).send('Logout')
})

// Use a regexp that matches all 'diary', 'menus', 'stats' routes
app.get('/diary', (req, res) => res.redirect('/'))
app.get('/menus', (req, res) => res.redirect('/'))
app.get('/stats', (req, res) => res.redirect('/'))

app.listen(port, async () => {
  const articles = await db.articles.count()
  const usuarios = await db.users.count()
  console.log(`Shopping List listening on port ${port}: ${articles} articles, ${usuarios} users`);
})

function requireAuth(req, res, next) {
  // Simulation of authentication (OAuth2)
  if (req.headers.authorization === 'Bearer 123456') {
    next()
  } else {
    // Unauthorized
    res.status(401).send('Unauthorized')
  }
}