// backend/routes/game.js
const express = require('express');
const router = express.Router();
const { User } = require('../Utils/db');
const { verifyToken } = require('../Utils/jwt');
const { calculatePayout } = require('../utils/payments'); // Importamos tu archivo

// POST /api/game/spin
router.post('/spin', verifyToken, async (req, res) => {
    try {
        const { bets } = req.body;
        if (!bets || bets.length === 0) return res.status(400).json({ message: 'Sin apuestas' });

        const user = await User.findById(req.user.userId);
        
        // Calcular cuánto intenta apostar
        let intentoApuesta = 0;
        bets.forEach(b => intentoApuesta += b.amt);

        // Validar si tiene saldo antes de girar
        if (user.saldo < intentoApuesta) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        // --- COMIENZA EL JUEGO ---

        // 1. Generar número ganador (0-36)
        const winningNumber = Math.floor(Math.random() * 37); // [cite: 37, 479]

        // 2. Usar tu utilidad para calcular todo
        const { totalPayout, totalBet, netChange, historialApuestas } = calculatePayout(bets, winningNumber); // [cite: 206, 215]

        // 3. Actualizar Saldo
        // Simplemente sumamos el cambio neto (si perdió es negativo, si ganó es positivo)
        user.saldo += netChange; // [cite: 37, 288]

        // 4. Guardar Historial de Juego (Requisito Rúbrica)
        // Usamos el campo 'apuestas' de tu esquema, no 'movimientos'
        user.apuestas.push(...historialApuestas); // [cite: 83, 290]

        // 5. Guardar en Mongo
        await user.save(); // [cite: 62]

        // 6. Responder al Frontend
        res.json({
            winningNumber,
            totalWon: totalPayout, // Para mostrar la animación de ganancia
            newBalance: user.saldo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// El resto de rutas (/bet, /history) se mantienen igual...
router.post('/bet', verifyToken, async (req, res) => { /* ... */ });
router.get('/history', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.apuestas.reverse().slice(0, 20)); // [cite: 83]
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

module.exports = router;