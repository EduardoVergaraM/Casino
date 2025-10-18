function loggear() {
    let user = document.getElementById('usuario-login').value;
    let pswd = document.getElementById('contrasena-login').value;

    localStorage.setItem('usuarioActual', user);

    let cuentas = JSON.parse(localStorage.getItem('cuentas')) || {};
    if (!cuentas[user]) {
        cuentas[user] = { saldo: 0, movimientos: [] };
        localStorage.setItem('cuentas', JSON.stringify(cuentas));
    }

    alert(`¡Bienvenido ${user}! Tu saldo actual es $${cuentas[user].saldo}`);
    window.location.href = "./perfil.html";


}

const loginForm = document.querySelector('form');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        loggear();
    });
}

function actualizarPerfil() {
    const usuario = localStorage.getItem('usuarioActual');
    const cuentas = JSON.parse(localStorage.getItem('cuentas'));
    const cuenta = cuentas[usuario];
    const historial = cuenta.movimientos.slice(-5);
    const saldoPerfil = document.getElementById('saldo-usuario');
    const usuarioPerfil = document.getElementById('usuario-perfil');



    if (saldoPerfil) saldoPerfil.textContent = `$${cuenta.saldo.toLocaleString()}`;
    if (usuarioPerfil) usuarioPerfil.textContent = `${usuario.toLowerCase()}`;



    const tablaPerfil = document.getElementById('registro');
    const filas = tablaPerfil.querySelectorAll('tr');

    filas.forEach((fila, i) => {
        const dato = historial[i];

        if (dato) {
            fila.cells[0].textContent = dato.fecha;
            fila.cells[1].textContent = dato.hora;
            fila.cells[2].textContent = dato.tipo;
            fila.cells[3].textContent = `$${dato.valor.toLocaleString()}`;
        } else {
            fila.cells[0].textContent = '';
            fila.cells[1].textContent = '';
            fila.cells[2].textContent = '';
            fila.cells[3].textContent = '';
        }

    })

}

function actualizarRuleta() {
    const usuario = localStorage.getItem('usuarioActual');
    const cuentas = JSON.parse(localStorage.getItem('cuentas'));
    const cuenta = cuentas[usuario];
    const saldoRuleta = document.getElementById('saldo-ruleta');
    const saldoBanco = document.getElementById('bankSpan');

    if (saldoBanco) saldoBanco.textContent = `${cuenta.saldo.toLocaleString()}`;
    if (saldoRuleta) saldoRuleta.textContent = `${cuenta.saldo.toLocaleString()}`;

}


document.addEventListener('DOMContentLoaded', function () {
    const usuario = localStorage.getItem('usuarioActual');
    if (!usuario) return;

    const cuentas = JSON.parse(localStorage.getItem('cuentas')) || {};
    const cuenta = cuentas[usuario];

    if (!cuenta) return;
    actualizarRuleta();

    const saldoActual = document.getElementById('saldo-actual');
    if (saldoActual) saldoActual.textContent = `$${cuenta.saldo.toLocaleString()}`;
    actualizarPerfil();

});

