const path = require('path');
const cors = require('cors');

const express = require('express');
const { json } = require('express');

const app = express();
const { corsMiddleware } = require('../middlewares/cors.js');

const parcheggiRouter = require('./parcheggi.js');



app.use(json()) // Adding the json middleware to parse incoming request bodies as JSON
 
app.use(cors())

app.use(express.json());

app.use('/api/v2/parkings', parcheggiRouter) // Mounting the parcheggiRouter to handle requests for the '/apiParcheggi/parcheggi' endpoint

module.exports =  app;
