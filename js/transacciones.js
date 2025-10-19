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

function deposito() {
    let usuario = localStorage.getItem('usuarioActual');
    let cuentas = JSON.parse(localStorage.getItem('cuentas'));
    let saldo = cuentas[usuario].saldo;

    let monto = Number(document.getElementById('deposito').value);

    cuentas[usuario].saldo += monto;
    const actual = new Date();
    cuentas[usuario].movimientos.push({
        tipo: 'Depósito',
        valor: "+" + monto,
        fecha: actual.toLocaleDateString(),
        hora: actual.toLocaleTimeString()

    })

    localStorage.setItem('cuentas', JSON.stringify(cuentas));
    document.getElementById('saldo-actual').textContent = `$${cuentas[usuario].saldo}`;

}


function retiro() {
    let usuario = localStorage.getItem('usuarioActual');
    let cuentas = JSON.parse(localStorage.getItem('cuentas'));
    let saldo = cuentas[usuario].saldo;

    let monto = Number(document.getElementById('retiro').value);

    if (monto > saldo) {
        alert('MONTO SUPERIOR AL DISPONIBLE');
        return;
    }

    cuentas[usuario].saldo -= monto;
    const actual = new Date();
    cuentas[usuario].movimientos.push({
        tipo: 'Retiro',
        valor: -monto,
        fecha: actual.toLocaleDateString(),
        hora: actual.toLocaleTimeString()

    })

    localStorage.setItem('cuentas', JSON.stringify(cuentas));
    document.getElementById('saldo-actual').textContent = `$${cuentas[usuario].saldo}`;
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
    if(verificaExp()){
        alert('FECHA DE EXPIRACION DE LA TARJETA CADUCADA');
        return;
    }
    abrirModal('modal-confirmar-retiro');
});

// Botones Modal Confirmar Depósito
document.getElementById('boton-confirmar-deposito').addEventListener('click', () => {
    deposito();
    cerrarModal('modal-confirmar-deposito');
    abrirModal('modal-realizado');
});
document.getElementById('boton-cancelar-deposito').addEventListener('click', () => {
    cerrarModal('modal-confirmar-deposito');
});

// Botones Modal Confirmar Retiro
document.getElementById('boton-confirmar-retiro').addEventListener('click', () => {
    retiro();
    cerrarModal('modal-confirmar-retiro');
    abrirModal('modal-realizado');
});
document.getElementById('boton-cancelar-retiro').addEventListener('click', () => {
    cerrarModal('modal-confirmar-retiro');
});

// Modal Realizado
document.getElementById('boton-cerrar-realizado').addEventListener('click', () => {
    cerrarModal('modal-realizado');
});


