import fs from 'fs';

export async function login(file, userData, callback) {
let userFound = [];
const userNotFoundError = {
    error: true,
    message: 'login: No se encontraron resultados'
}
const fileNotFoundError = {
    error: true,
    message: 'login: El fichero no existe'
}
console.log('login', userData);
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, fileData) {
        const parsedData = JSON.parse(fileData.toString());
        // Filter by filterParams
        userFound = parsedData.filter((user) => {
            return user.email === userData.email && user.password === userData.password 
        });
        if (userFound.length === 0) {
          console.log(userNotFoundError);
          if (callback) {
            return callback(userNotFoundError);
          }
          return [];
        }
        if (err) {
          console.log('filter', err);
          return err;
        }
        // Return filtered data
        if (callback) {
          return callback(userFound);
        }
        return userFound
      });
    } else {
      console.log(fileNotFoundError);
      if (callback) {
        return callback(fileNotFoundError);
      }
    }
  } catch (err) {
    console.log('filter', `Error: ${err}`);
    return err;
  }
}