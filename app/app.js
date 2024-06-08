const path = require('path');
const cors = require('cors');
const express = require('express');


const app = express();






const parcheggiRouter = require('./parcheggi.js');
const feedbackRouter = require('./feedback.js');
/**
 * Express.js parsing middleware
 */
app.use(express.json());


/**
 * Serve static files for the front-end
 */
app.use(express.static(path.join(__dirname, '..', 'static')));


/**
 * CORS requests
 */
app.use(cors())


/**
 * Log requests to console
 */
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url)
    next()
})


















app.use('/api/v1/parkings', parcheggiRouter) 

app.use('/api/v1/feedback', feedbackRouter) 

module.exports =  app;