const mongoose = require('mongoose');

// Definición del Usuario (Schema)
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
    try {
        // Asegúrate de tener MongoDB corriendo en tu PC
        await mongoose.connect('mongodb://localhost:27017/casino_cit2008'); 
        console.log('MongoDB conectado exitosamente');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = { connectDB, User };