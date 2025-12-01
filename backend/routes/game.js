const express = require('express');
const router = express.Router();
const { User } = require('../Utils/db');
const { verifyToken } = require('../Utils/jwt');
const { calculatePayout } = require('../Utils/payments');

router.post('/spin', verifyToken, async (req, res) => {
    try {
        const { bets } = req.body;
        if (!bets || bets.length === 0) return res.status(400).json({ message: 'Sin apuestas' });

        const user = await User.findById(req.user.userId);
        
        let intentoApuesta = 0;
        bets.forEach(b => intentoApuesta += b.amt);

        if (user.saldo < intentoApuesta) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        // == Inicio del juego ==============
        const winningNumber = Math.floor(Math.random() * 37);

        const { totalPayout, totalBet, netChange, historialApuestas } = calculatePayout(bets, winningNumber);

        user.saldo += netChange;

        user.apuestas.push(...historialApuestas);

        await user.save(); 

        res.json({
            winningNumber,
            totalWon: totalPayout,
            newBalance: user.saldo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.post('/bet', verifyToken, async (req, res) => { /* ... */ });
router.get('/history', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.apuestas.reverse().slice(0, 20)); 
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

module.exports = router;