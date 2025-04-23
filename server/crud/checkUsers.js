import fs from 'fs';
// ESTA FUNCION CHECKEA SI HAY UN CORREO EN EL BD, LA USAMOS PARA VERIFICAR, EN CASO DE QUE HAYA 
// UNO IGUAL ARROJA ERROR Y ENTONCES NO PERMITIMOS EL REGISTRO
export async function checkUsers(file, userData, callback) {
let userFound = [];
const userFoundError = {
    error: true,
    message: 'Sign in: Se encontro el email'
}
const fileNotFoundError = {
    error: true,
    message: 'Sign in : El fichero no existe'
}
console.log('Sign in', userData);
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, fileData) {
        const parsedData = JSON.parse(fileData.toString());
        // Filter by filterParams
        userFound = parsedData.filter((user) => {
            return user.email === userData.email 
        });
        console.log(userFound.length)
        if (userFound.length > 0) {
          console.log(userFoundError);
          if (callback) {
            return callback(userFoundError);
          }
          return [];
        }
        if (err) {
          console.log('filter', err);
          return err;
        }
        // Return filtered data
        if (callback) {
          console.log(userData)
          return callback(userData);
        }
        return userData
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