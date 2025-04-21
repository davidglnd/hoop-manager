// server.api.js
import * as http from "node:http";
import * as qs from "node:querystring";
import { crud } from "./server.crud.js";

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const USERS_URL = './server/BBDD/users.json'
const ARTICLES_URL = './server/BBDD/articles.json'

/**
 * Returns an object with the action name and id from the given pathname.
 * For example, for "/create/articles/:id", it will return { name: "/create/articles", id: ":id" }
 * @param {string} pathname
 * @returns {{name: string, id: string}}
 */
function getAction(pathname) {
  // /create/articles/:id
  const actionParts = pathname.split('/');
  return {
    name: `/${actionParts[1]}/${actionParts[2]}`,
    id: actionParts[3]
   }
}

http.createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlParams = Object.fromEntries(url.searchParams);
    const action = getAction(url.pathname);
    const statusCode = 200
    let responseData = []
    let chunks = []
    console.log(request.method, url.pathname, urlParams, action.name, action.id);
    // Set Up CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, DELETE, POST');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    // Return on OPTIONS request
    // More info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
    if (request.method === 'OPTIONS') {
      // Validación de permisos del servidor, antes de dar acceso a la API
      response.end();
      return;
    }
    // Continue on GET request
    // TODO: use POST/PUT/DELETE methods when needed
    switch (action.name) {
      // 1. Shopping list Articles
      case '/create/articles':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          let parsedData = qs.parse(body.toString())
          console.log('datos recibidos desde el front al crear articulo', parsedData)
          crud.create(ARTICLES_URL, parsedData, (data) => {
            // console.log(`server create article ${data.name} creado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;
      case '/update/articles':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          let parsedData = qs.parse(body.toString())
          crud.update(ARTICLES_URL, action.id, parsedData, (data) => {
            // console.log(`server update article ${action.id} modificado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;
      case '/delete/articles':
        crud.delete(ARTICLES_URL, action.id, (data) => {
          // console.log('server delete article', action.id, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;
      case '/read/articles':
        crud.read(ARTICLES_URL, (data) => {
          // console.log('server read articles', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
      case '/filter/articles':
        crud.filter(ARTICLES_URL, urlParams, (data) => {
          // console.log('server filter articles', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;
      // 2. Users
      case '/read/users':
        crud.read(USERS_URL, (data) => {
          // console.log('server read users', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
      case '/create/users':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          let parsedData = qs.parse(body.toString())
          console.log('datos recibidos desde el front al crear usuario', parsedData)
          crud.create(USERS_URL, parsedData, (data) => {
            console.log(`server create user ${data.name} creado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;
      default:
        console.log('no se encontro el endpoint');

        response.write(JSON.stringify('no se encontro el endpoint'));
        response.end();
        break;
    }
  })
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');