const express = require('express');
const router = express.Router();
const {User} = require('../Utils/db');
const {verifyToken} = require('../Utils/jwt');


// == Obtener perfil ===================
router.get('/profile', verifyToken, async(req, res) =>{
    try{
        const user = await User.findById(req.user.userId).select('-password');

        if(!user){
        return res.status(404).json({message: 'Usuario no encontrado'});
        }

        res.json(user);



    }catch(error){
        res.status(500).json({message: 'Error al obtener perfil'});
    }

});

// == Depositos ========================
router.post('/deposit', verifyToken, async(req, res) =>{
    try{
        //revisar si se llama saldo en bd
        const {saldo} = req.body;
        const monto = parseInt(saldo);

        if(!monto || monto<=0){
            return res.status(400).json({message: 'El monto debe ser positivo'});
        }

        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'});

        }

        user.saldo+=monto;
        await user.save();

        res.json({message: 'Deposito exitoso', nuevoSaldo: user.saldo});

        
    }catch(error){
        res.status(500).json({message: 'Error en el deposito'});
    }
});


// == Retiros ===========================
router.post('/withdraw', verifyToken, async(req,res) =>{
    try{
        const{saldo} = req.body;
        const monto = parseInt(saldo);

        if(!monto || monto<=0){
            return res.status(400).json({message: 'El monto debe ser positivo'});    
        }

        const user = await User.findById(req.user.userId);

        if(user.saldo < monto){
            return res.status(400).json({message: 'Saldo insuficiente'});

        }

        user.saldo -= monto;
        await user.save();
        res.json({message: 'Retiro exitoso', nuevoSaldo: user.saldo});
    }catch(error){
        res.status(500).json({message: 'Error en el retiro'});
    }
});

module.exports= router;
