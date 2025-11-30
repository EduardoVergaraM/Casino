document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const mensaje = document.getElementById('mensaje');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            mensaje.textContent = 'Todos los campos son obligatorios';
            mensaje.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'  // Para enviar/recibir cookies
            });

            const data = await response.json();

            if (response.ok) {
                mensaje.textContent = data.message || 'Login exitoso';
                mensaje.style.color = 'green';
                // Redirigir a perfil o index después de 1s
                setTimeout(() => {
                    window.location.href = '/perfil.html';
                }, 1000);
            } else {
                mensaje.textContent = data.message || 'Error en el login';
                mensaje.style.color = 'red';
            }
        } catch (error) {
            console.error('Error en login:', error);
            mensaje.textContent = 'Error en el servidor';
            mensaje.style.color = 'red';
        }
    });
});