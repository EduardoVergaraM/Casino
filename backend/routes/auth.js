const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User} = require('../Utils/db.js');
const {generateToken} = require('../Utils/jwt.js');

//== Registro ==========

router.post('/register' , async(req, res) =>{
    try{
        const{nombreCompleto, email, username, password, fechaNacimiento} = req.body;

        if(!nombreCompleto || !email ||!username || !password || !fechaNacimiento){
            return res.status(400).json({message: 'Todos los campos son obligatorios'});
        }

        const userExists = await User.findOne({ $or: [{email}, {username}]});
        if(userExists){
            return res.status(400).json({message: 'Usuario o email ya existentes'});
        }

        //hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(password, salt);


        const newUser = new User({
            nombreCompleto,
            email,
            username,
            password: hashedPassword,
            fechaNacimiento,
            saldo:0
        });

        await newUser.save();

        res.status(201).json({message: 'Usuario registrado exitosamente'});


    }catch(error){
        console.error('Error en registro:', error);
        res.status(500).json({message: 'Error en el servidor'});
    }


});


// == Login ==============

router.post('/login', async(req,res)=> {
    try{
        const{username, password} = req.body;

        const user = await user.findOne({username});
        if(!user){
            return res.status(400).json({message: 'Usuario no encontrado'});
        }

        const pswValida= await bcrypt.compare(password, user.password);
        if(!pswValida){
            return res.status(400).json({message: 'Contraseña incorrecta'});
        }

        generateToken(res, user._id, user.username);
        //revisar si es que hay id del usuario

        res.json({
            message: 'Login exitoso',
            user: {username:user.username, saldo:user.saldo}
        });

    }catch(error){
        console.error('Error en el login', error);
        res.status(500).json({message: 'Error en el servidor'});
    }
});

// == Cerrar sesion ==========
router.psot('/logout', (req, res) => {
    res.cookie('jwt','', {expires: new Date(0)});
    res.json({message: 'Sesion cerrada'});
});

