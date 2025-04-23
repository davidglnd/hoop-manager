import fs from 'fs';

export async function checkClubCod(file, userData, callback) {
let clubFound = [];
const clubNotFoundError = {
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
        clubFound = parsedData.filter((club) => {
            return club.codigo === userData.clubAsoc
        });
        if (clubFound.length === 0) {
          console.log(clubNotFoundError);
          if (callback) {
            return callback(clubNotFoundError);
          }
          return [];
        }
        if (err) {
          console.log('filter', err);
          return err;
        }
        // Return filtered data
        if (callback) {
          return callback(clubFound);
        }
        return clubFound
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