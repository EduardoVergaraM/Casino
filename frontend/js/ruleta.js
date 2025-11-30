let bankValue = 0;
let currentBet = 0;
let wager = 5;
let lastWager = 0;
let bet = [];
let numbersBet = [];
let previousNumbers = [];
let girar = true;
let serverResult = null;

let numRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
let wheelnumbersAC = [0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];

startGame();


// Función inicial para empezar el juego
function startGame() {
  addEventListeners();
  const pnContent = document.getElementById('pnContent');
  pnContent.onwheel = (e) => {
    e.preventDefault();
    pnContent.scrollLeft += e.deltaY;
  };
}

// Función principal para agregar listeners a todas las áreas de apuestas
function addEventListeners() {
  addDoubleStreetListeners();
  addSplitStreetListeners();
  addVerticalSplitListeners();
  addCornerListeners();
  addBbtopListeners();
  addNumberBoardListeners();
  addBo3Listeners();
  addOtoListeners();
  addChipDeckListeners();
  addModalListeners();
}

// Listeners para double streets (wlttb_top)
function addDoubleStreetListeners() {
  document.querySelectorAll('#wlttb_top .ttbbetblock').forEach((el, i) => {
    const num = `${1 + 3 * i}, ${2 + 3 * i}, ${3 + 3 * i}, ${4 + 3 * i}, ${5 + 3 * i}, ${6 + 3 * i}`;
    el.onclick = () => setBet(el, num, 'double_street', 5);
    el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, 'double_street', 5); };
  });
}

// Listeners para splits y streets (wlttb_1 a 3)
function addSplitStreetListeners() {
  [1, 2, 3].forEach(c => {
    document.querySelectorAll(`#wlttb_${c} .ttbbetblock`).forEach((el, i) => {
      let num, type, odds;
      if (c < 3) {
        num = `${(2 - (c - 1)) + 3 * i}, ${(3 - (c - 1)) + 3 * i}`;
        type = 'split';
        odds = 17;
      } else {
        num = `${1 + 3 * i}, ${2 + 3 * i}, ${3 + 3 * i}`;
        type = 'street';
        odds = 11;
      }
      el.onclick = () => setBet(el, num, type, odds);
      el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, type, odds); };
    });
  });
}

// Listeners para vertical splits (wlrtl_1 a 11)
function addVerticalSplitListeners() {
  [...Array(11).keys()].forEach(c => {
    document.querySelectorAll(`#wlrtl_${c + 1} > div`).forEach((el, i) => {
      const num = `${(3 + 3 * c) - i}, ${(6 + 3 * c) - i}`;
      el.onclick = () => setBet(el, num, 'split', 17);
      el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, 'split', 17); };
    });
  });
}

// Listeners para corners (wlcb_1 y 2)
function addCornerListeners() {
  [1, 2].forEach(c => {
    document.querySelectorAll(`#wlcb_${c} .cbbb`).forEach((el, i) => {
      const count = (c === 1) ? i + 1 : i + 12;
      let baseNums = [2, 3, 5, 6];
      let offset = (count < 12) ? (count - 1) * 3 : (count - 12) * 3;
      let adjust = (count < 12) ? 0 : -1;
      const num = baseNums.map(n => n + adjust + offset).join(', ');
      el.onclick = () => setBet(el, num, 'corner_bet', 8);
      el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, 'corner_bet', 8); };
    });
  });
}

// Listeners para 1-18 y 19-36 (bbtop)
function addBbtopListeners() {
  document.querySelectorAll('.bbtoptwo').forEach((el, i) => {
    const num = i === 0 ? '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18' : '19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36';
    const type = i === 0 ? 'outside_low' : 'outside_high';
    el.onclick = () => setBet(el, num, type, 1);
    el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, type, 1); };
  });
}

// Listeners para números, cero y columnas (number_board)
function addNumberBoardListeners() {
  const zero = document.querySelector('.number_0');
  zero.onclick = () => setBet(zero, '0', 'zero', 35);
  zero.oncontextmenu = (e) => { e.preventDefault(); removeBet(zero, '0', 'zero', 35); };

  const numberBlocks = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, '2 to 1', 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, '2 to 1', 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, '2 to 1'];
  document.querySelectorAll('.number_board > div:not(.number_0)').forEach((el, i) => {
    const value = numberBlocks[i];
    if (value !== '2 to 1') {
      el.onclick = () => setBet(el, `${value}`, 'inside_whole', 35);
      el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, `${value}`, 'inside_whole', 35); };
    } else {
      const num = (i === 12) ? '3,6,9,12,15,18,21,24,27,30,33,36' : ((i === 25) ? '2,5,8,11,14,17,20,23,26,29,32,35' : '1,4,7,10,13,16,19,22,25,28,31,34');
      el.onclick = () => setBet(el, num, 'outside_column', 2);
      el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, 'outside_column', 2); };
    }
  });
}

// Listeners para docenas (bo3_board)
function addBo3Listeners() {
  document.querySelectorAll('.bo3_block').forEach((el, i) => {
    const num = (i === 0) ? '1,2,3,4,5,6,7,8,9,10,11,12' : ((i === 1) ? '13,14,15,16,17,18,19,20,21,22,23,24' : '25,26,27,28,29,30,31,32,33,34,35,36');
    el.onclick = () => setBet(el, num, 'outside_dozen', 2);
    el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, 'outside_dozen', 2); };
  });
}

// Listeners para par/rojo/negro/impar (oto_board)
function addOtoListeners() {
  document.querySelectorAll('.oto_block').forEach((el, i) => {
    const num = (i === 0) ? '2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36'
      : ((i === 1) ? '1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36'
        : ((i === 2) ? '2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35'
          : '1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35'));
    el.onclick = () => setBet(el, num, 'outside_oerb', 1);
    el.oncontextmenu = (e) => { e.preventDefault(); removeBet(el, num, 'outside_oerb', 1); };
  });
}

// Listeners para fichas (chipDeck)
function addChipDeckListeners() {
  document.querySelectorAll('.cdChip:not(.clearBet):not(.custom)').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('.cdChipActive').forEach(active => active.classList.remove('cdChipActive'));
      el.classList.add('cdChipActive');
      wager = parseInt(el.querySelector('.cdChipSpan').innerText);
    };
  });
  document.querySelector('.custom').onclick = () => {
    document.getElementById('customBetModal').style.display = 'block';
  };
  document.querySelector('.clearBet').onclick = () => {
    document.getElementById('confirmClearModal').style.display = 'block';
  };
}

// Listeners para modales
function addModalListeners() {
  document.getElementById('acceptCustom').onclick = () => {
    let amount = parseInt(document.getElementById('customAmount').value);
    if (amount > 0 && amount <= bankValue) {
      wager = amount;
      document.querySelectorAll('.cdChipActive').forEach(active => active.classList.remove('cdChipActive'));
    }
    document.getElementById('customBetModal').style.display = 'none';
    document.getElementById('customAmount').value = '';
  };
  document.getElementById('cancelCustom').onclick = () => {
    document.getElementById('customBetModal').style.display = 'none';
    document.getElementById('customAmount').value = '';
  };
  document.getElementById('acceptClear').onclick = () => {
    bankValue += currentBet;
    currentBet = 0;
    updateBankAndBet();
    clearBet();
    removeChips();
    document.getElementById('confirmClearModal').style.display = 'none';
  };
  document.getElementById('cancelClear').onclick = () => {
    document.getElementById('confirmClearModal').style.display = 'none';
  };
}

// Función auxiliar para actualizar bank y bet spans
function updateBankAndBet() {
  document.getElementById('bankSpan').innerText = bankValue.toLocaleString();
  document.getElementById('betSpan').innerText = currentBet.toLocaleString();

  const saldoGrande = document.getElementById('saldo-ruleta');
  if (saldoGrande) {
      saldoGrande.innerText = `$${bankValue.toLocaleString()}`;
  }
}

// Función para limpiar apuestas
function clearBet() {
  bet = [];
  numbersBet = [];
}

// Función para colocar una apuesta
function setBet(element, numbers, type, odds) {
  lastWager = wager;
  if (bankValue < wager) wager = bankValue;
  if (wager === 0) return;
  if (!girar) return;
  // Crear botón de spin si no existe
  if (!document.querySelector('.spinBtn')) {
    const spinBtn = document.createElement('div');
    spinBtn.className = 'spinBtn';
    spinBtn.innerText = 'Girar';
    spinBtn.onclick = () => { spinBtn.remove(); spin(); };
    document.getElementById('container').appendChild(spinBtn);
  }

  bankValue -= wager;
  currentBet += wager;
  updateBankAndBet();

  // Buscar si ya hay apuesta en este tipo y números
  for (let i = 0; i < bet.length; i++) {
    if (bet[i].numbers === numbers && bet[i].type === type) {
      bet[i].amt += wager;
      updateChip(element, bet[i].amt);
      return;
    }
  }

  // Nueva apuesta
  bet.push({ amt: wager, type: type, odds: odds, numbers: numbers });
  numbers.split(',').map(Number).forEach(num => {
    if (!numbersBet.includes(num)) numbersBet.push(num);
  });
  createChip(element, wager);
}

// Función auxiliar para crear chip
function createChip(element, amount) {
  const color = amount < 5 ? 'red' : (amount < 10 ? 'blue' : (amount < 100 ? 'orange' : 'gold'));
  const chip = document.createElement('div');
  chip.className = `chip ${color}`;
  const span = document.createElement('span');
  span.className = 'chipSpan';
  span.innerText = amount;
  chip.appendChild(span);
  element.appendChild(chip);
}

// Función auxiliar para actualizar chip existente
function updateChip(element, amount) {
  const color = amount < 5 ? 'red' : (amount < 10 ? 'blue' : (amount < 100 ? 'orange' : 'gold'));
  const chip = element.querySelector('.chip');
  if (chip) {
    chip.className = `chip ${color}`;
    chip.querySelector('.chipSpan').innerText = amount;
  }
}

// Función para remover apuesta
function removeBet(element, numbers, type, odds) {
  if (wager === 0) wager = 100;

  for (let i = 0; i < bet.length; i++) {
    if (bet[i].numbers === numbers && bet[i].type === type && bet[i].amt > 0) {
      let removeAmount = Math.min(wager, bet[i].amt);
      bet[i].amt -= removeAmount;
      bankValue += removeAmount;
      currentBet -= removeAmount;
      updateBankAndBet();

      if (bet[i].amt === 0) {
        element.querySelector('.chip')?.remove();
        bet.splice(i, 1);
        i--;
      } else {
        updateChip(element, bet[i].amt);
      }
    }
  }

  if (currentBet === 0) {
    document.querySelector('.spinBtn')?.remove();
  }
}

// Función para girar la ruleta
async function spin() {
  if (bet.length === 0) return;

  girar = false; // Bloquear botón

  try {
    // Enviar apuestas al servidor
    const response = await fetch('/api/game/spin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bets: bet })
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message || 'Error al girar');
      girar = true;
      return;
    }

    // Guardamos el resultado pero NO lo mostramos todavía
    serverResult = await response.json();

    // Iniciamos la animación visual con el número que decidió el servidor
    spinWheel(serverResult.winningNumber);

    // Esperamos 10 segundos (lo que dura tu animación) para mostrar el resultado final
    setTimeout(() => finalizarJugada(), 10000);

  } catch (error) {
    console.error('Error:', error);
    girar = true;
  }
}

// Función separada para calcular ganancias después del spin
function finalizarJugada() {
  if (!serverResult) return;

  const { winningNumber, totalWon, newBalance } = serverResult;

  // 1. Actualizar Saldo Real
  bankValue = newBalance;
  updateBankAndBet();

  // 2. Mostrar Notificación de Victoria
  if (totalWon > 0) {
    let betTotal = 0;
    bet.forEach(b => betTotal += b.amt);
    let winValue = totalWon - betTotal; // Ganancia neta para mostrar

    win(winningNumber, winValue, betTotal);
  }

  // 3. Actualizar Tabla de Historial
  actualizarTablaApuestas();

  // 4. Lógica Visual de la Bola (Tu código original de UI)
  const pnClass = numRed.includes(winningNumber) ? 'pnRed' : (winningNumber === 0 ? 'pnGreen' : 'pnBlack');
  const pnSpan = document.createElement('span');
  pnSpan.className = pnClass;
  pnSpan.innerText = winningNumber;
  const pnContent = document.getElementById('pnContent');
  pnContent.appendChild(pnSpan);
  pnContent.scrollLeft = pnContent.scrollWidth;

  // 5. Limpieza y Reinicio
  bet = [];
  numbersBet = [];
  currentBet = 0;
  removeChips();
  wager = lastWager;
  girar = true;
}

// Función para mostrar notificación de ganancia
function win(winningSpin, winValue, betTotal) {
  if (winValue === 0) return;
  const notification = document.createElement('div');
  notification.id = 'notification';
  const nSpan = document.createElement('div');
  nSpan.className = 'nSpan';
  const nsNumber = document.createElement('span');
  nsNumber.className = 'nsnumber';
  nsNumber.style.color = numRed.includes(winningSpin) ? 'red' : 'black';
  nsNumber.innerText = winningSpin;
  nSpan.appendChild(nsNumber);
  nSpan.appendChild(document.createTextNode(' Win'));
  const nsWin = document.createElement('div');
  nsWin.className = 'nsWin';
  nsWin.innerHTML = `
    <div class="nsWinBlock">Bet: ${betTotal}</div>
    <div class="nsWinBlock">Win: ${winValue}</div>
    <div class="nsWinBlock">Payout: ${winValue + betTotal}</div>
  `;
  nSpan.appendChild(nsWin);
  notification.appendChild(nSpan);
  document.getElementById('container').prepend(notification);
  setTimeout(() => notification.style.opacity = '0', 3000);
  setTimeout(() => notification.remove(), 4000);
}

// Función para animar la rueda
function spinWheel(winningSpin) {
  const wheel = document.querySelector('.wheel');
  const ballTrack = document.querySelector('.ballTrack');
  const degree = wheelnumbersAC.indexOf(winningSpin) * 9.73 + 362;

  // Animación inicial rápida
  wheel.style.animation = 'wheelRotate 5s linear infinite';
  ballTrack.style.animation = 'ballRotate 1s linear infinite';

  // Ralentizar bola después de
  setTimeout(() => {
    ballTrack.style.animation = 'ballRotate 2s linear infinite';
  }, 2000);

  // Detener bola en posición ganadora 
  setTimeout(() => {
    const style = document.createElement('style');
    style.innerText = `@keyframes ballStop { from { transform: rotate(0deg); } to { transform: rotate(-${degree}deg); } }`;
    document.head.appendChild(style);
    ballTrack.style.animation = 'ballStop 3s linear';
    setTimeout(() => style.remove(), 3000); // Limpiar estilo
  }, 6000);

  // Posición final de bola
  setTimeout(() => {
    ballTrack.style.transform = `rotate(-${degree}deg)`;
  }, 9000);

  // Detener rueda
  setTimeout(() => {
    wheel.style.animation = '';
    girar = true;
  }, 10000);
}

// Función para remover todos los chips
function removeChips() {
  document.querySelectorAll('.chip').forEach(chip => chip.remove());
}

window.addEventListener('storage', (event) => {
  if (event.key === 'saldoActualizado' && event.newValue === 'true') {
    console.log('Saldo actualizado desde otra pestaña, recargando ruleta...');
    location.reload();
    localStorage.setItem('saldoActualizado', 'false');
  }
});

async function actualizarTablaApuestas() {
  try {
    const response = await fetch('/api/game/history');
    if (!response.ok) return;

    const historial = await response.json();
    const cuerpoTabla = document.getElementById('tabla-ultimas-apuestas');

    if (cuerpoTabla) {
      cuerpoTabla.innerHTML = '';
      // Mostrar los últimos 5
      historial.slice(0, 5).forEach(apuesta => {
        const fila = document.createElement('tr');
        const signo = apuesta.variacion >= 0 ? '+' : '';
        fila.innerHTML = `
                    <td>${apuesta.tipo}</td>
                    <td>$${apuesta.monto.toLocaleString()}</td>
                    <td>${apuesta.resultado}</td>
                    <td>${signo}$${apuesta.variacion.toLocaleString()}</td>
                `;
        cuerpoTabla.appendChild(fila);
      });
    }
  } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar saldo real al iniciar
        const res = await fetch('/api/user/profile');
        if (res.ok) {
            const user = await res.json();
            bankValue = user.saldo;
            updateBankAndBet();
            actualizarTablaApuestas();
        } else {
            window.location.href = 'login.html';
        }
    } catch (e) { console.error(e); }
});