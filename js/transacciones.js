function verificaExp(exp) {
    const fecha = new Date();
    let year = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;

    const [yearExp, mesExp] = exp.split('-').map(Number);

    if (yearExp < year || (yearExp === year && mesExp < mes)) {
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
    let exp = document.getElementById('expiracion').value;
    if (verificaExp(exp)) {
        alert('TARJETA CADUCADA');
        return;
    } else if (monto <= 0) {
        alert('MONTO INVALIDO');
        return;
    }

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

    if(monto>saldo){
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



document.getElementById('form-deposito').addEventListener('submit', function (e) {
    e.preventDefault();
    deposito();
})

document.getElementById('form-retiro').addEventListener('submit', function (e) {
    e.preventDefault();
    retiro();
})


