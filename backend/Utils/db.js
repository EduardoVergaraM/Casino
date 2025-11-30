const mongoose = require('mongoose');
const DB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
    nombreCompleto: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    saldo: { type: Number, default: 0 },
    movimientos: [{
        tipo: String,  
        valor: String,  
        fecha: String,   
        hora: String
    }]
});

const User = mongoose.model('User', userSchema);

const connectDB = async () => {
    if (!DB_URI) {
        console.error('Error: La variable MONGODB_URI no está definida.');
        process.exit(1);
    }
    
    try {
        await mongoose.connect(DB_URI); 
        console.log('MongoDB Atlas conectado exitosamente');
    } catch (error) {
        console.error('Error conectando a MongoDB Atlas:', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB, User };