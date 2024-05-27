const path = require('path');
const cors = require('cors');
const express = require('express');
const { json } = require('express');
const bodyParser = require('body-parser');

const app = express();
const { corsMiddleware } = require('../middlewares/cors.js');

const parcheggiRouter = require('./parcheggi.js');



app.use(json()) // Adding the json middleware to parse incoming request bodies as JSON
 
app.use(cors())

app.use(express.json());

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use('/api/v1/parkings', parcheggiRouter) // Mounting the parcheggiRouter to handle requests for the '/apiParcheggi/parcheggi' endpoint

module.exports =  app;
