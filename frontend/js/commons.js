// Función para verificar si el usuario está autenticado (intenta fetch profile)
async function isAuthenticated() {
    try {
        const response = await fetch('/api/user/profile', {
            //method:'GET', REVISAR SI AGREGAR ESTO
            credentials: 'include'  // Enviar cookie JWT
        });
        return response.ok;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}

// Función para obtener datos del usuario (perfil)
async function getUserProfile() {
    try {
        const response = await fetch('/api/user/profile', {
            //method:'GET', REVISAR SI AGREGAR ESTO
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Error al obtener perfil');
        }
        return await response.json();
    } catch (error) {
        console.error('Error cargando perfil:', error);
        return null;
    }
}

// Función para actualizar el menú de navegación basado en estado de auth
async function updateMenu() {
    const authLinks = document.querySelectorAll('.auth-link');  // Enlaces protegidos: perfil, transacciones, ruleta
    const guestLinks = document.querySelectorAll('.guest-link');  // Enlaces login/registro
    const userNameElem = document.querySelector('.user-name');  // Elemento para mostrar nombre usuario
    const logoutBtn = document.querySelector('.logout-btn');  // Botón de logout si existe

    const isAuth = await isAuthenticated();

    if (isAuth) {
        const user = await getUserProfile();
        if (user) {
            if (userNameElem) userNameElem.textContent = user.username;
            authLinks.forEach(link => link.style.display = 'block');
            guestLinks.forEach(link => link.style.display = 'none');
        }
        // Agregar listener a logout si existe
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    } else {
        authLinks.forEach(link => link.style.display = 'none');
        guestLinks.forEach(link => link.style.display = 'block');
        if (userNameElem) userNameElem.textContent = '';
    }
}

// Función para manejar logout
// async function handleLogout() {
//     try {
//         const response = await fetch('/api/auth/logout', {
//             method: 'POST',
//             credentials: 'include'
//         });

//         if (response.ok) {
//             window.location.href = './index.html';  // Redirigir a home
//         } else {
//             alert('Error al cerrar sesión');
//         }
//     } catch (error) {
//         console.error('Error en logout:', error);
//         alert('Error en el servidor');
//     }
// }

// Protección de rutas: redirigir si no auth en páginas protegidas
async function protectRoute() {
    const protectedPages = ['perfil.html', 'transacciones.html', 'ruleta.html'];  // Agrega más si necesario
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        const isAuth = await isAuthenticated();
        if (!isAuth) {
            window.location.href = './login.html';
        }
    }
}

// Inicialización al cargar página
document.addEventListener('DOMContentLoaded', async () => {
    await protectRoute();  // Proteger rutas
    await updateMenu();  // Actualizar menú basado en auth
    await actualizarPerfil();  // Actualizar datos si aplica

});