async function isAuthenticated() {
    try {
        const response = await fetch('/api/user/profile', {
            method:'GET',
            credentials: 'include'
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
            method:'GET',
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

// Función para actualizar el menú de navegación
async function updateMenu() {
    const authLinks = document.querySelectorAll('.auth-link');
    const guestLinks = document.querySelectorAll('.guest-link'); 
    const userNameElem = document.querySelector('.user-name'); 
    const logoutBtn = document.querySelector('.logout-btn');

    const isAuth = await isAuthenticated();

    if (isAuth) {
        const user = await getUserProfile();
        if (user) {
            if (userNameElem) userNameElem.textContent = user.username;
            authLinks.forEach(link => link.style.display = 'block');
            guestLinks.forEach(link => link.style.display = 'none');
        }
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
async function handleLogout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = './index.html';  // Redirigir a home
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error en logout:', error);
        alert('Error en el servidor');
    }
}

// Protección de rutas
async function protectRoute() {
    const protectedPages = ['perfil.html', 'transacciones.html', 'ruleta.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        const isAuth = await isAuthenticated();
        if (!isAuth) {
            window.location.href = './login.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await protectRoute(); 
    await updateMenu(); 
    await actualizarPerfil();  

});