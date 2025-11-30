const jwt = require('jsonwebtoken');
const SECRET_KEY= process.env.JWT_SECRET;

// comando para usar en terminal mas tarde
//npm install cookie-parser 


//generacion del token 

const generateToken = (res,userId, username) =>{

    const token = jwt.sign(
        {userId, username},
        SECRET_KEY,
        {expiresIn: '10m'}
    );

    res.cookie('jwt', token,{
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge:10*60*1000
    });
};

//Middleware

const verifyToken = (req, res, next) =>{
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({message: 'No autorizado, por favor inicie sesion.'});
    }

    try{
        const decoded = jwt.verify(token, SECRET_KEY);

        req.user = decoded;
        next();
    }catch(error){

        return res.status(401).json({message: 'Sesion invalida o expirada'});
    }
};

module.exports = {generateToken, verifyToken};
