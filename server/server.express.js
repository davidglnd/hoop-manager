import express from 'express';
import bodyParser from 'body-parser';
import { db } from "./server.mongodb.js";


import { crearCodigoClub } from "./controller/creacionCodigoClub.js";

const app = express();
const port = process.env.PORT;

// Static server
app.use(express.static('src'));
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// METODOS GET 
app.get('/api/check/', async (req, res) => {
  const numeroUsuarios = await db.users.count()
  const numeroClubs = await db.clubs.count()
  res.send(`Hay ${numeroUsuarios} cuentas de usuarios y  ${numeroClubs} cuentas de clubs`)
})

app.get('/api/read/users', async (req, res) => {
    res.json(await db.users.get())
})

app.get('/api/filter/users/:email', async (req, res) => {
    console.log(req.params.email)
    res.json(await db.users.get({ email: req.params.email }))
})

app.get('/api/read/clubs', async (req, res) => {
    res.json(await db.clubs.get())
})

app.get('/api/read/equipos', async (req, res) => {
    res.json(await db.equipos.get())
})

app.get('/api/read/jugadores', async (req, res) => {
    res.json(await db.jugadores.get())
})

// METODOS POST
app.post('/api/create/users', async (req, res) => {
    const existeClubAsociado = await db.clubs.get({codigo : req.body.clubAsoc})
    const existeUsuario = await db.users.get({email : req.body.email})

    if(existeClubAsociado.length === 0 ){
        res.send({error: `El club al que intentas registrarte no existe (CODIGO DE CLUB: ${req.body.clubAsoc})`})
    }else if(existeUsuario > 0){
        res.send({error: 'Email registrado'})
    }else if(req.body.email === ''){
        res.send({error: 'Introduce un email'})
    }else{
        res.json(await db.users.create(req.body))
    }
})

app.post('/api/create/clubs', async (req, res) => {
    const existeClub = await db.clubs.get({email: req.body.email})

    if(existeClub.length > 0){
        res.send({error: 'Email registrado'})
    }else if(req.body.email === ''){
        res.send({error: 'Introduce un email'})
    }else{
        crearCodigoClub(req.body)
        res.json(await db.clubs.create(req.body))
    }


})

app.post('/api/login', async (req, res) => {
    console.log(req.body)
    const userLogIn = await db.users.logIn({email: req.body.email, password: req.body.password})
    console.log(userLogIn)

    if(userLogIn === null){
        res.send({error: true, message:'Error en el login'})
    }else{
        res.json(userLogIn)
    }
})


app.listen(port, async () => {
  const usuarios = await db.users.count()
  const clubs = await db.clubs.count()
  console.log(`Hoop Manager listening on port ${port}:  ${usuarios} users, ${clubs} clubs`);
})
