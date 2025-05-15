export function comprobarSession(){
    if(sessionStorage.getItem('HOOP_MANAGER') !== null){
        console.log('estas login')
        return
    }else if(sessionStorage.getItem('HOOP_MANAGER_CLUB') !== null && location.pathname === '/admin-club.html'){
        console.log('estas en el admin')
        return
    }else if(location.pathname === '/login.html'){
        console.log('pantalla login')
        return
    }else if (location.pathname !== '/index.html' ) {
        // Redirigimos a la home si el usuario no está identificado
        location.href = '/index.html'
    }
}