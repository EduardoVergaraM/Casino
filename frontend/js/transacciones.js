function verificaExp() {
    const fecha = new Date();
    let year = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let expY = Number(document.getElementById('year').value) + 2000;
    let expM = Number(document.getElementById('mes').value);

    if (expY < year || (expY === year && expM < mes)) {
        return true;
    } else {
        return false;
    }
}

async function deposito() {
    const montoForm = document.getElementById('deposito').value;

    try{
        const response = await fetch('/api/user/deposito',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({amount: montoForm})
        });

        const data = await response.json();

        if(response.ok){

            document.getElementById('saldo-actual').textContent = `$${data.nuevoSaldo}`;
            return true;
        }else{
            alert(data.message);
            return false;
        }
    }catch(error){
        console.error('Error:', error);
        alert('Error de conexion con el servidor' || 'Error al realizar deposito');
        return false;
    }

}


async function retiro() {
    const montoForm = document.getElementById('retiro').value;

    try{
        const response = await fetch('/api/user/retiro',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({amount: montoForm})
        });

        const data = await response.json();

        if(response.ok){
            document.getElementById('saldo-actual'.textContent = `$${data.nuevoSaldo}`);
            return true;
        }else{
            alert(data.message || 'Error al realizar deposito');
            return false;
        }

    }catch(error){
        console.error('Error:',error);
        alert('Error de conexion con el servidor');
        return false;
    }
}

function abrirModal(id) {
    document.getElementById(id).style.display = 'block';
}

function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Cerrar al hacer click fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Formulario Depósito
document.getElementById('form-deposito').addEventListener('submit', function(e){
    e.preventDefault();
    if(verificaExp()){
        alert('FECHA DE EXPIRACION DE LA TARJETA CADUCADA');
        return;
    }
    abrirModal('modal-confirmar-deposito');
});

// Formulario Retiro
document.getElementById('form-retiro').addEventListener('submit', function(e){
    e.preventDefault();
    abrirModal('modal-confirmar-retiro');
});

// Botones Modal Confirmar Depósito
document.getElementById('boton-confirmar-deposito').addEventListener('click', async () => {

    const exito = await deposito();
    cerrarModal('modal-confirmar-deposito');

    if(exito){
        abrirModal('modal-realizado');
    }
});
document.getElementById('boton-cancelar-deposito').addEventListener('click', () => {
    cerrarModal('modal-confirmar-deposito');
});

// Botones Modal Confirmar Retiro
document.getElementById('boton-confirmar-retiro').addEventListener('click', async () => {
    const exito = await retiro();
    cerrarModal('modal-confirmar-retiro');

    if(exito){
        abrirModal('modal-realizado');
    }
});
document.getElementById('boton-cancelar-retiro').addEventListener('click', () => {
    cerrarModal('modal-confirmar-retiro');
});

// Modal Realizado
document.getElementById('boton-cerrar-realizado').addEventListener('click', () => {
    cerrarModal('modal-realizado');
});

window.addEventListener('DOMContentLoaded', async() =>{
    try{
        const res = await fetch('/api/user/profile');
        if (res.ok){
            const user = await res.json();

            document.getElementById('saldo-actual').textContent = `$${user.saldo}`;
        }else{
             window.location.href = 'login.html';
        }
    }catch(error){
        console.error('Error cargando perfil:', error);
    }
});
