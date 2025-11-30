document.addEventListener('DOMContentLoaded', async () => {
    const nombreCompleto = document.getElementById('nombreCompleto');
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const saldoElem = document.getElementById('saldo');
    const tablaMovimientos = document.getElementById('tablaMovimientos');
    const logoutBtn = document.getElementById('logoutBtn');
    const mensaje = document.getElementById('mensaje');  // Opcional para errors

    // Función para cargar perfil
    async function cargarPerfil() {
        try {
            const response = await fetch('/api/user/profile', {
                credentials: 'include'  // Enviar cookie JWT
            });

            if (response.status === 401) {
                window.location.href = '/login.html';  // Redirigir si no autorizado
                return;
            }

            if (!response.ok) {
                throw new Error('Error al obtener perfil');
            }

            const user = await response.json();

            // Mostrar datos
            nombreCompleto.textContent = user.nombreCompleto;
            email.textContent = user.email;
            username.textContent = user.username;
            fechaNacimiento.textContent = new Date(user.fechaNacimiento).toLocaleDateString();
            saldoElem.textContent = `$${user.saldo.toFixed(2)}`;

            // Mostrar movimientos (últimos 10 por ej.)
            tablaMovimientos.innerHTML = '';  // Limpiar tabla
            user.movimientos.slice(-10).forEach(mov => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${mov.tipo}</td>
                    <td>${mov.valor}</td>
                    <td>${mov.fecha}</td>
                    <td>${mov.hora}</td>
                `;
                tablaMovimientos.appendChild(fila);
            });
        } catch (error) {
            console.error('Error cargando perfil:', error);
            if (mensaje) {
                mensaje.textContent = 'Error al cargar perfil. Por favor, inicia sesión.';
                mensaje.style.color = 'red';
            }
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        }
    }

    // Cargar al inicio
    await cargarPerfil();

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok) {
                    window.location.href = '/index.html';  // Redirigir a home
                } else {
                    alert('Error al cerrar sesión');
                }
            } catch (error) {
                console.error('Error en logout:', error);
                alert('Error en el servidor');
            }
        });
    }
});