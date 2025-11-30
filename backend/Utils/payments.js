const betOdds = {
    'double_street': 5,    // 5:1
    'split': 17,           // 17:1
    'street': 11,          // 11:1
    'corner_bet': 8,       // 8:1
    'outside_low': 1,      // 1:1 (1-18)
    'outside_high': 1,     // 1:1 (19-36)
    'zero': 35,            // 35:1 (0)
    'inside_whole': 35,    // 35:1 (número individual)
    'outside_column': 2,   // 2:1 (columnas)
    'outside_dozen': 2,    // 2:1 (docenas)
    'outside_even': 1,     // Par (even)
    'outside_odd': 1,      // Impar (odd)
    'outside_red': 1,      // Rojo
    'outside_black': 1     // Negro
};

function calculatePayout(bets, winningNumber) {
    let totalWin = 0;    // Ganancias puras (odds * amt)
    let totalBet = 0;    // Total apostado
    let details = [];    // Detalles por apuesta

    bets.forEach(bet => {
        const odds = betOdds[bet.type] || 0;  // Odds por tipo, default 0 si inválido
        const betNumbers = bet.numbers.split(',').map(n => parseInt(n.trim()));
        totalBet += bet.amt;

        if (betNumbers.includes(winningNumber)) {
            const winAmount = bet.amt * odds;  // Ganancia pura
            totalWin += winAmount;
            details.push({
                type: bet.type,
                numbers: bet.numbers,
                amt: bet.amt,
                win: true,
                payout: winAmount + bet.amt,  // Incluye devolución de stake
                net: winAmount
            });
        } else {
            details.push({
                type: bet.type,
                numbers: bet.numbers,
                amt: bet.amt,
                win: false,
                payout: 0,
                net: -bet.amt
            });
        }
    });

    const netChange = totalWin - (totalBet - totalWin);  // Neto: ganancias - pérdidas (simplificado: totalWin - totalBet + totalWin si múltiples)

    return {
        totalWin,
        totalBet,
        netChange: totalWin - totalBet,  // Cambio neto en saldo
        details
    };
}

/**
 * @param {number} netChange - Cambio neto en saldo (puede ser positivo o negativo)
 */
async function registerMovement(user, netChange, tipo = 'Apuesta Ruleta') {
    const now = new Date();
    const fecha = now.toISOString().split('T')[0];  // YYYY-MM-DD
    const hora = now.toLocaleTimeString('es-CL', { hour12: false });  // HH:MM:SS

    user.movimientos.push({
        tipo,
        valor: `${netChange >= 0 ? '+' : ''}${netChange.toFixed(2)}`,  // String con signo y 2 decimales
        fecha,
        hora
    });

    user.saldo += netChange;  // Actualiza saldo
    await user.save();
}

module.exports = { calculatePayout, registerMovement };