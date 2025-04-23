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

app.post('/create/users', (req, res) => {
  crud.read(USERS_URL, (users) => {
    const newUser = req.body
    
    const existsEmail = users.filter((user) => user.email === newUser.email)

    if(existsEmail.length === 0){
      crud.read(CLUBS_URL, (clubs) => {

        const codigoClub = clubs.filter((club) => club.codigo === newUser.clubAsoc)

        if(codigoClub.length === 1){
          crud.create(USERS_URL, req.body, (data) => {
          console.log(`server create user ${data.name} creado`, data)
          res.send(JSON.stringify(data));
          })
        }else{
          console.log('Codigo de club no encontrado')
          res.send({error: 'Codigo de club no encontrado'})
        }
      })
    }else{
      console.log('Email ya usado')
      res.send({error: 'Email registrado'})
    }

  });

});

app.post('/create/clubs', (req, res) => {
  crud.read(CLUBS_URL, (clubs) => {
    const newClub = req.body

    const existsEmail = clubs.filter((club) => club.email === newClub.email)

    if(existsEmail.length === 0){
      crud.createClub(CLUBS_URL, req.body, (data) => {
        console.log(`server create club ${data.nombre} creado`, data)
        res.send(JSON.stringify(data));
      })
    }else{
      console.log('Email club ya usado')
      res.send({error: 'Email registrado'})
    }
  })

});

// app.put('/api/update/articles/:id',  (req, res) => {
//   crud.update(USERS_URL, req.params.id, req.body, (data) => )
  
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})