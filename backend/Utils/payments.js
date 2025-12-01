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
    'outside_even': 1,
    'outside_odd': 1,
    'outside_red': 1,
    'outside_black': 1,
    'outside_oerb': 1      
};

function calculatePayout(bets, winningNumber) {
    let totalPayout = 0;    // Dinero total que vuelve al usuario (Ganancia + Apuesta)
    let totalBet = 0;       // Total apostado
    let historialApuestas = []; 

    bets.forEach(bet => {
        const odds = betOdds[bet.type] || 0;
        totalBet += bet.amt;

        let betNumbers = [];
        if (typeof bet.numbers === 'string') {
            betNumbers = bet.numbers.split(',').map(n => parseInt(n.trim()));
        } else if (Array.isArray(bet.numbers)) {
            betNumbers = bet.numbers;
        } else {
            betNumbers = [parseInt(bet.numbers)];
        }

        // Verificar si ganó
        const gano = betNumbers.includes(winningNumber);

        if (gano) {
            const profit = bet.amt * odds;
            const payout = profit + bet.amt;

            totalPayout += payout;

            historialApuestas.push({
                tipo: bet.type,
                monto: bet.amt,
                resultado: 'Victoria',
                variacion: profit
            });
        } else {
            historialApuestas.push({
                tipo: bet.type,
                monto: bet.amt,
                resultado: 'Derrota',
                variacion: -bet.amt
            });
        }
    });

    const netChange = totalPayout - totalBet;

    return {
        totalPayout,
        totalBet,
        netChange,
        historialApuestas
    };
}

module.exports = { calculatePayout };