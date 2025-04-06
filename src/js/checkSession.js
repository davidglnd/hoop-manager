export function comprobarSession(){
    if(sessionStorage.getItem('user') !== null){
        console.log('estas login')
    }else if(sessionStorage.getItem('club') !== null && location.pathname === '/admin-club.html'){
        console.log('estas en el admin')
    }else if (location.pathname !== '/index.html') {
        // Redirigimos a la home si el usuario no está identificado
        location.href = '/index.html'
    }
}