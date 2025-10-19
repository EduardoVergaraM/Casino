let bankValue = JSON.parse(localStorage.getItem('cuentas'))[localStorage.getItem('usuarioActual')].saldo;;
let currentBet = 0;
let wager = 5;
let lastWager = 0;
let bet = [];
let numbersBet = [];
let previousNumbers = [];
let girar = true;

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
  addBbtopListeners();
  addOtoListeners();
  addChipDeckListeners();
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
  document.querySelectorAll('.cdChip:not(.clearBet)').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('.cdChipActive').forEach(active => active.classList.remove('cdChipActive'));
      el.classList.add('cdChipActive');
      wager = parseInt(el.querySelector('.cdChipSpan').innerText);
    };
  });
  document.querySelector('.clearBet').onclick = () => {
    bankValue += currentBet;
    currentBet = 0;
    updateBankAndBet();
    clearBet();
    removeChips();
  };
}

// Función auxiliar para actualizar bank y bet spans
function updateBankAndBet() {
  document.getElementById('bankSpan').innerText = bankValue.toLocaleString();
  document.getElementById('betSpan').innerText = currentBet.toLocaleString();
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
    spinBtn.innerText = 'spin';
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
function spin() {
  const winningSpin = Math.floor(Math.random() * 37);
  girar = false;
  spinWheel(winningSpin);
  setTimeout(() => calculateWin(winningSpin), 10000);
}

// Función separada para calcular ganancias después del spin
function calculateWin(winningSpin) {
  let winValue = 0;
  let betTotal = 0;
  let usuario = localStorage.getItem('usuarioActual');
  let cuentas = JSON.parse(localStorage.getItem('cuentas'));
  let estadoCuenta = cuentas[usuario].saldo;

  if (numbersBet.includes(winningSpin)) {
    bet.forEach(b => {
      if (b.numbers.split(',').map(Number).includes(winningSpin)) {
        const payout = b.odds * b.amt + b.amt;
        bankValue += payout;
        winValue += b.odds * b.amt;
        betTotal += b.amt;
      }
    });
    win(winningSpin, winValue, betTotal);
  }
  currentBet = 0;
  estadoCuenta= bankValue;
  cuentas[usuario].saldo = bankValue;
  localStorage.setItem('cuentas', JSON.stringify(cuentas));
  document.getElementById('saldo-ruleta').textContent = bankValue;
  document.getElementById('bankSpan').textContent = bankValue;

  updateBankAndBet();


  // Agregar número ganador al historial
  const pnClass = numRed.includes(winningSpin) ? 'pnRed' : (winningSpin === 0 ? 'pnGreen' : 'pnBlack');
  const pnSpan = document.createElement('span');
  pnSpan.className = pnClass;
  pnSpan.innerText = winningSpin;
  const pnContent = document.getElementById('pnContent');
  pnContent.appendChild(pnSpan);
  pnContent.scrollLeft = pnContent.scrollWidth;

  bet = [];
  numbersBet = [];
  removeChips();
  wager = lastWager;
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

  // Ralentizar bola después de 2s
  setTimeout(() => {
    ballTrack.style.animation = 'ballRotate 2s linear infinite';
  }, 2000);

  // Detener bola en posición ganadora después de 6s
  setTimeout(() => {
    const style = document.createElement('style');
    style.innerText = `@keyframes ballStop { from { transform: rotate(0deg); } to { transform: rotate(-${degree}deg); } }`;
    document.head.appendChild(style);
    ballTrack.style.animation = 'ballStop 3s linear';
    setTimeout(() => style.remove(), 3000); // Limpiar estilo
  }, 6000);

  // Posición final de bola después de 9s
  setTimeout(() => {
    ballTrack.style.transform = `rotate(-${degree}deg)`;
  }, 9000);

  // Detener rueda después de 10s
  setTimeout(() => {
    wheel.style.animation = '';
    girar = true;
  }, 10000);
}

// Función para remover todos los chips
function removeChips() {
  document.querySelectorAll('.chip').forEach(chip => chip.remove());
}