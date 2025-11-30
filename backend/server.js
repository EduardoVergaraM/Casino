require('dotenv').config();
const apiRoutes = require('./routes/index.js');
const config = require('../commons/configs/site.config.js');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectDB} = require('/Utils/db.js')

const app = express();
app.use(express.json());

// == Cookies ===========================
app.use(cookieParser());

// == Base de datos =====================
connectDB();

// == API ===============================
app.use('/api', apiRoutes);

// == Archivos ==========================
app.use(express.static(path.join(__dirname, '../frontend')));

// == Fallback ==========================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// == Servidor ==========================
app.listen(3042, () => {
    console.log(`Servidor Express escuchando en puerto 3042`);
    console.log(`Dominio configurado: ${config.DOMAIN}`);
});

