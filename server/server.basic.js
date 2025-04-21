// /server/server.basic.js
import * as http from 'node:http';
import * as url from 'node:url';

const articlesJSON = [
  {
    "id": "leche_1",
    "name": "Leche",
    "qty": "12",
    "price": "24"
  },
  {
    "id": "carne_2",
    "name": "Carne",
    "qty": "1",
    "price": "5"
  },
  {
    "id": "fruta_3",
    "name": "Fruta",
    "qty": "1",
    "price": "2"
  },
  {
    "id": "cereales_4",
    "name": "Cereales",
    "qty": "1",
    "price": "3"
  },
  {
    "id": "yogures_5",
    "name": "Yogures",
    "qty": "4",
    "price": "2"
  }
];
// Simulo la BBDD
const usersDB = []

http.createServer(function server_onRequest (request, response) {
  // La dirección solicitada desde el navegador:
    let pathname = url.parse(request.url).pathname;
    let direccion = new URL(`http://${process.env.IP ?? 'localhost'}:${process.env.PORT}${request.url}`)
    let responseJSON = {}
    const menuNavegacion = `
    <menu>
      <li><a href="/">HOME</a></li>
      <li><a href="/login">LOGIN</a></li>
      <li><a href="/signup">SIGN UP</a></li>
      <li><a href="/api/get/users">LEER USUARIOS</a></li>
      <li><a href="/api/get/articles">LEER ARTICULOS</a></li>
    </menu>
    `

    // Router
    switch (pathname) {
      case '/':
      case '/index':
      case '/index.html':
        console.log(`HOME solicitado`);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(`<h1>HOME</h1>${menuNavegacion}`);
        break
      case '/login':
      case '/login.html':
        console.log(`LOGIN solicitado`);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(`<h1>LOGIN</h1>${menuNavegacion}`);
        break;
      case '/signup':
      case '/signup.html':
        console.log(`SIGN UP solicitado`);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(`
          <h1>SIGN UP</h1>
          ${menuNavegacion}
          <form action="/api/create/user">
            <input type="text" name="name" placeholder="Nombre de usuario" required>
            <button type="submit">Sign Up</button>
          </form>
          `);
        break;
      case '/api':
        console.log(`API solicitado`);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(articlesJSON));
        break;
      case '/api/get/articles':
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(articlesJSON));
        break;
      case '/api/get/users':
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(usersDB));
        break;
      case '/api/create/user':
        console.log(`API solicitado: crear usuario ${direccion.searchParams.get('name')}`);
        response.writeHead(200, {'Content-Type': 'application/json'});
        // Simulo la creación en BBDD
        usersDB.push({
          name: direccion.searchParams.get('name')
        })
        responseJSON.user = {
          name: direccion.searchParams.get('name')
        }
        response.write(JSON.stringify(responseJSON));
        break;
      default:
        console.log(`Request for ${pathname} received.`);
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("<h1>404 Not found</h1>");
    }
    // console.log(request.headers);

    // Set Up CORS
    // response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Content-Type', 'application/json');
    // response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    // response.setHeader("Access-Control-Allow-Headers", "*");
    // response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    // response.writeHead(200);

    // response.write(articlesJSON);
    response.end();
}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');