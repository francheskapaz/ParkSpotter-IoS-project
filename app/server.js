const express = require('express');
const app = express();
const parkingRouter = require('./app.js'); // Importa il modulo di routing

app.use(express.json()); // Middleware per il parsing del corpo delle richieste JSON

app.use('/api/parking', parkingRouter); 

module.exports = app; // Esporta l'app Express
