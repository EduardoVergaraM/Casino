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
    // Agregamos los tipos específicos por si acaso
    'outside_even': 1,
    'outside_odd': 1,
    'outside_red': 1,
    'outside_black': 1,
    // ¡IMPORTANTE! Este es el que usa tu frontend para Rojo/Negro/Par/Impar
    'outside_oerb': 1      
};

function calculatePayout(bets, winningNumber) {
    let totalPayout = 0;    // Dinero total que vuelve al usuario (Ganancia + Apuesta)
    let totalBet = 0;       // Total apostado
    let historialApuestas = []; 

    bets.forEach(bet => {
        const odds = betOdds[bet.type] || 0;
        totalBet += bet.amt;

        // Manejo robusto de los números (si viene string o array)
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
            // Ganancia Pura = Monto * Odds
            const profit = bet.amt * odds;
            // Retorno Total = Ganancia Pura + Lo que apostó (Devolución)
            const payout = profit + bet.amt;
            
            totalPayout += payout;

            historialApuestas.push({
                tipo: bet.type,
                monto: bet.amt,
                resultado: 'Victoria',
                variacion: profit // Guardamos cuánto ganó limpio
            });
        } else {
            historialApuestas.push({
                tipo: bet.type,
                monto: bet.amt,
                resultado: 'Derrota',
                variacion: -bet.amt // Perdió lo apostado
            });
        }
    });

    // netChange: Cuánto cambia el saldo final.
    // Si apostó 10 y ganó (retorno 20), netChange es +10.
    // Si apostó 10 y perdió (retorno 0), netChange es -10.
    const netChange = totalPayout - totalBet;

    return {
        totalPayout,       // Total ganado (bruto)
        totalBet,          // Total apostado
        netChange,         // Variación real del saldo
        historialApuestas  // Array listo para guardar en MongoDB
    };
}

module.exports = { calculatePayout };