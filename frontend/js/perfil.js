document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUserProfile();

    if (user) {
        // 2. Rellenar Datos Personales
        const campos = {
            'nombre-perfil': user.nombreCompleto,
            'correo-perfil': user.email,
            'usuario-perfil': user.username,
            'saldo-usuario': `$${user.saldo.toLocaleString()}`
        };

        // Recorremos los IDs y ponemos el texto correspondiente
        for (const [id, valor] of Object.entries(campos)) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = valor;
            }
        }

        // 3. Rellenar Tabla de Historial
        const tabla = document.getElementById('registro');
        
        if (tabla && user.movimientos) {
            // Limpiamos contenido previo
            tabla.innerHTML = '';

            // Tomamos los últimos 10 movimientos y los invertimos (el más nuevo primero)
            const historial = user.movimientos.slice().reverse().slice(0, 10);

            if (historial.length === 0) {
                tabla.innerHTML = '<tr><td colspan="4">No hay movimientos registrados.</td></tr>';
            } else {
                historial.forEach(mov => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${mov.fecha}</td>
                        <td>${mov.hora}</td>
                        <td>${mov.tipo}</td>
                        <td>${mov.valor}</td>
                    `;
                    tabla.appendChild(fila);
                });
            }
        }
    }
});