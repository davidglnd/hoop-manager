import express from 'express';
import path from 'path';
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
  res.send(`Hay ${numeroUsuarios} cuentas de usuarios`)
})

app.get('/api/read/users', async (req, res) => {
    res.json(await db.users.get())
})

app.get('/api/filter/users/:email', async (req, res) => {
    console.log(req.params.email)
    res.json(await db.users.get({ email: req.params.email }))
})

app.get('/api/filter/equipos/:club', async (req, res) => {
    res.json(await db.equipos.get({clubAsoc: req.params.club}))
})

app.get('/api/filter/jugadores/:categoria', async (req, res) => {
    res.json(await db.jugadores.get({categoria: req.params.categoria}))
})

app.get('/api/filter/equipo/:id', async (req, res) => {
    res.json(await db.equipos.getById(req.params.id))
})
app.get('/api/filter/calendario/:idEquipo', async (req, res) => {
    res.json(await db.calendario.getById(req.params.idEquipo))
})
app.get('/api/read/equipos/jugadores/:idEquipo', async (req, res) => {
    const EQUIPO_SELECCIONADO = await db.equipos.getById(req.params.idEquipo)
    const JUGADORES_EQUIPO = []
    
    for(const ID of EQUIPO_SELECCIONADO.jugadores){
        const JUGADOR = await db.jugadores.getById(ID)
        JUGADORES_EQUIPO.push(JUGADOR)
    }

    res.json({EQUIPO_SELECCIONADO,JUGADORES_EQUIPO})
})
// METODOS PUT
app.put('/api/update/user/:id', async (req, res) => {
    res.json(await db.users.update(req.params.id, req.body))
})
// METODOS POST
app.post('/api/create/users', async (req, res) => {
    const existeClubAsociado = await db.users.get({codigo : req.body.clubAsoc})
    const existeUsuario = await db.users.get({email : req.body.email})

    if(req.body.clubAsoc === ''){
        res.send({error: `Introduce un codigo de club`})
    }else if(existeClubAsociado.length === 0 ){
        res.send({error: `El club al que intentas registrarte no existe (CODIGO DE CLUB: ${req.body.clubAsoc})`})
    }else if(existeUsuario > 0){
        res.send({error: 'Email registrado'})
    }else if(req.body.email === ''){
        res.send({error: 'Introduce un email'})
    }else{
        res.json(await db.users.create(req.body))
        console.log('hola')
    }
})
                    //----AHORA LOS CREA EN USERS---//
app.post('/api/create/clubs', async (req, res) => {
    const existeClub = await db.users.get({email: req.body.email})

    if(existeClub.length > 0){
        res.send({error: 'Email registrado'})
    }else if(req.body.email === ''){
        res.send({error: 'Introduce un email'})
    }else{
        crearCodigoClub(req.body)
        res.json(await db.users.create(req.body))
    }


})

app.post('/api/login', async (req, res) => {
    const userLogIn = await db.users.logIn({email: req.body.email, password: req.body.password})
    console.log(userLogIn)

    if(userLogIn === null){
        res.send({error: true, message:'Error en el login'})
    }else{
        res.json(userLogIn)
    }
})

app.post('/api/update/equipo/jugadores', async (req, res) => {
    const JUGADORES_SELECCIONADOS = req.body
    const EQUIPO = await db.equipos.getById(req.body.equipo)

    JUGADORES_SELECCIONADOS.jugadores.forEach(async id => {
        await db.equipos.updateJugadores(req.body.equipo,id)
        await db.jugadores.updateEquipo(id,req.body.equipo)
    });
    res.json(EQUIPO.nombre + ' ha sido actualizado')
})

app.post('/api/create/convocatoria/temporada/jornada/seleccionada', async (req, res) => {
    const CONVOCATORIA = {
        mensaje_convocatoria: req.body.mensaje_convocatoria,
        jornada: req.body.jornada,
        jugadores_convocados: []   
    }
    req.body.jugadores_convocados.forEach(jugador => {
        CONVOCATORIA.jugadores_convocados.push(jugador)
    })
    await db.calendario.createConvocatoria(CONVOCATORIA,req.body.idEquipo)
    res.json("Convocatora creada")
    

    
})



// Capturar rutas no encontradas
app.use((req, res) =>{
    return res.status(404).sendFile(path.join(import.meta.dirname, "../src", "404.html"));
})

app.listen(port, async () => {
  const usuarios = await db.users.count()
  console.log(`Hoop Manager listening on port ${port}:  ${usuarios} users`);
})
