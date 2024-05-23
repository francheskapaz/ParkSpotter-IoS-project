const path = require('path');
const cors = require('cors');

const express = require('express');
const { json } = require('express');

const app = express();
const { corsMiddleware } = require('../middlewares/cors.js');

const parcheggiRouter = require('./parcheggi.js');

const feedbackRouter = require('./feedback.js');



app.use(json()) // Adding the json middleware to parse incoming request bodies as JSON
 
app.use(cors())

app.use(express.json());

//app.use(corsMiddleware()) // Using the cors middleware to enable Cross-Origin Resource Sharing (CORS)
app.use('/api/v1/parkings', parcheggiRouter) // Mounting the parcheggiRouter to handle requests for the '/apiParcheggi/parcheggi' endpoint


app.use('/api/v1/feedback', feedbackRouter) // Mounting the feedbackRouter to handle requests for the '/apiParcheggi/feedback' endpoint

module.exports =  app;
