// Función para verificar si el usuario está autenticado (intenta fetch profile)
async function isAuthenticated() {
    try {
        const response = await fetch('/api/user/profile', {
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

// Función para manejar login (reemplaza loggear())
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('usuario-login').value;
    const password = document.getElementById('contrasena-login').value;
    const mensaje = document.getElementById('mensaje');  // Asume un div para mensajes

    if (!username || !password) {
        if (mensaje) {
            mensaje.textContent = 'Todos los campos son obligatorios';
            mensaje.style.color = 'red';
        }
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            if (mensaje) {
                mensaje.textContent = data.message || 'Login exitoso';
                mensaje.style.color = 'green';
            }
            // Redirigir a perfil
            setTimeout(() => {
                window.location.href = './perfil.html';
            }, 1000);
        } else {
            if (mensaje) {
                mensaje.textContent = data.message || 'Error en el login';
                mensaje.style.color = 'red';
            }
        }
    } catch (error) {
        console.error('Error en login:', error);
        if (mensaje) {
            mensaje.textContent = 'Error en el servidor';
            mensaje.style.color = 'red';
        }
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

// Función para actualizar perfil y saldo (reemplaza actualizarPerfil())
async function actualizarPerfil() {
    const user = await getUserProfile();
    if (!user) return;

    // Elementos comunes
    const saldoPerfil = document.getElementById('saldo-usuario');
    const usuarioPerfil = document.getElementById('usuario-perfil');
    const saldoRuleta = document.getElementById('saldo-ruleta');
    const saldoBanco = document.getElementById('bankSpan');

    if (saldoPerfil) saldoPerfil.textContent = `$${user.saldo.toLocaleString()}`;
    if (usuarioPerfil) usuarioPerfil.textContent = `${user.username.toLowerCase()}`;
    if (saldoRuleta) saldoRuleta.textContent = `${user.saldo.toLocaleString()}`;
    if (saldoBanco) saldoBanco.textContent = `${user.saldo.toLocaleString()}`;

    // Actualizar tabla de movimientos (últimos 5)
    const tablaPerfil = document.getElementById('registro');
    if (tablaPerfil) {
        const historial = user.movimientos.slice(-5);
        const filas = tablaPerfil.querySelectorAll('tr');

        filas.forEach((fila, i) => {
            const dato = historial[i];
            if (dato) {
                fila.cells[0].textContent = dato.fecha;
                fila.cells[1].textContent = dato.hora;
                fila.cells[2].textContent = dato.tipo;
                fila.cells[3].textContent = `${dato.valor}`;
            } else {
                fila.cells[0].textContent = '';
                fila.cells[1].textContent = '';
                fila.cells[2].textContent = '';
                fila.cells[3].textContent = '';
            }
        });
    }
}

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
    await updateMenu();  // Actualizar menú basado en auth
    await protectRoute();  // Proteger rutas
    await actualizarPerfil();  // Actualizar datos si aplica

    // Listener para form de login si existe
    const loginForm = document.querySelector('form#loginForm');  // Ajusta id si necesario
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Listener para spin en ruleta si aplica
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('spinBtn')) {
            await actualizarPerfil();
        }
    });
});