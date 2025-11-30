document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.querySelector('form');

    formulario.addEventListener('submit', async (e) => {

        e.preventDefault();

        const nombreInput = document.getElementById('nombre').value;
        const correoInput = document.getElementById('correo').value;
        const nacimientoInput = document.getElementById('nacimiento').value;
        const usuarioInput = document.getElementById('usuario').value;
        const contrasenaInput = document.getElementById('contrasena').value;
        const confirmacionInput = document.getElementById('confirmacion').value;

        const fechaNac = new Date(nacimientoInput);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad < 18) {
            alert('Lo sentimos, debes ser mayor de 18 años para registrarte.');
            return;
        }

        if (contrasenaInput !== confirmacionInput) {
            alert('Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }

        const datosUsuario = {
            nombreCompleto: nombreInput,
            email: correoInput,
            username: usuarioInput,
            password: contrasenaInput,
            fechaNacimiento: nacimientoInput
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Registro exitoso. Ahora serás redirigido al inicio de sesión.');
                window.location.href = 'login.html';
            } else {
                alert(result.message || 'Error al registrar usuario');
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            alert('Hubo un problema al conectar con el servidor.');
        }
    });
});