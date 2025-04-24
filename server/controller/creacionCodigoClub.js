export function crearCodigoClub(club){
    if(!club.codigo || club.codigo === ''){
        club.codigo = club.siglas + Math.floor(Math.random() * 999)
    }
    return club
}