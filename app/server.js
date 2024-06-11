const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = require('./app'); // Importa il tuo router

// Connetti al database
mongoose.connect('mongodb://localhost:27017/nome_del_tuo_database', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', router); // Utilizza il tuo router per le rotte che iniziano con /api

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server in ascolto sulla porta ${port}`));
