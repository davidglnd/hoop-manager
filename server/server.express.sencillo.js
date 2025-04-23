import express from 'express';
import bodyParser from 'body-parser';
import { crud } from "./server.crud.js";

const app = express();
const port = process.env.PORT;
const USERS_URL = './server/BBDD/users.json'
const CLUBS_URL = './server/BBDD/clubes.json'

// Static server
app.use(express.static('src'));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Router de la aplicación
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// API ENDPOINTS
app.get('/read/users', (req, res) => {
  crud.read(USERS_URL, (data) => {
    console.log('servidor leyendo usuarios del json', data)

    res.send(JSON.stringify(data));
  });
});

app.get('/read/clubs', (req, res) => {
  crud.read(CLUBS_URL, (data) => {
    console.log('servidor leyendo clubes del json', data) 
    res.send(JSON.stringify(data));
  });
})

app.post('/login', (req, res) => {
  crud.login(USERS_URL, req.body, (foundUserData) => {
    console.log('server login', foundUserData)
    res.send(JSON.stringify(foundUserData));
  });
})

app.post('/loginClub', (req, res) => {
  crud.login(CLUBS_URL, req.body, (foundClubData) => {
    console.log('server login Club', foundClubData)
    res.send(JSON.stringify(foundClubData));
  });
})

app.post('/checkUsers', (req,res) => {
  crud.checkUsers(USERS_URL, req.body, (foundUserData) => {
    res.send(JSON.stringify(foundUserData))
  })
})
app.post('/checkClubsCod', (req,res) => {
  crud.checkClubCod(CLUBS_URL, req.body, (foundUserData) => {
    res.send(JSON.stringify(foundUserData))
  })
})

app.post('/create/users', (req, res) => {
  crud.create(USERS_URL, req.body, (data) => {
    console.log(`server create user ${data.name} creado`, data)
    res.send(JSON.stringify(data));
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})