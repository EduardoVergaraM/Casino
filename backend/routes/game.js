const express = require('express');
const router = express.Router();
const { User } = require('../Utils/db');
const { verifyToken } = require('../Utils/jwt');
const { calculateWinnings } = require('../Utils/payments');

// 1. VALIDAR APUESTAS
router.post('/bet', verifyToken, async (req, res) => {
    try {
        const { bets } = req.body;
        if (!bets || bets.length === 0) return res.status(400).json({ message: 'Sin apuestas' });

        const user = await User.findById(req.user.userId);
        
        let totalApostado = 0;
        bets.forEach(b => totalApostado += b.amt);

        if (user.saldo < totalApostado) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        res.json({ message: 'Apuestas válidas', status: 'OK' });
    } catch (error) {
        res.status(500).json({ message: 'Error al validar' });
    }
});

// 2. GIRAR RULETA (Usando payments.js)
router.post('/spin', verifyToken, async (req, res) => {
    try {
        const { bets } = req.body;
        if (!bets || bets.length === 0) return res.status(400).json({ message: 'Sin apuestas' });

        const user = await User.findById(req.user.userId);
        
        // Calcular total apostado
        let totalApostado = 0;
        bets.forEach(b => totalApostado += b.amt);

        // Validar saldo
        if (user.saldo < totalApostado) return res.status(400).json({ message: 'Saldo insuficiente' });

        // 1. Cobrar la apuesta inicial
        user.saldo -= totalApostado;

        // 2. Generar Ganador (0-36)
        const winningNumber = Math.floor(Math.random() * 37);

        // 3. USAR LA UTILIDAD PAYMENTS.JS PARA CALCULAR TODO
        const { totalGanado, historialApuestas } = calculateWinnings(bets, winningNumber);

        // 4. Pagar premios
        user.saldo += totalGanado;

        // 5. Guardar historial en el usuario
        // Usamos el operador spread (...) para agregar todo el historial nuevo al array existente
        user.apuestas.push(...historialApuestas);

        // 6. Guardar en BD
        await user.save();

        res.json({
            winningNumber,
            totalWon: totalGanado,
            newBalance: user.saldo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// 3. HISTORIAL
router.get('/history', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.apuestas.reverse().slice(0, 20)); 
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo historial' });
    }
});

module.exports = router;