const path = require('path');
const cors = require('cors')

const express = require('express');
const app = express();

const authentication = require('./authentication.js');
const users = require('./users.js');
const tokenChecker = require('./tokenChecker.js');

/**
 * Express.js parsing middleware
 */
app.use(express.json());


/**
 * Serve static files for the front-end
 */
// app.use('/', express.static('static'));
app.use(express.static(path.join(__dirname, '..', 'static'),{extensions:['html']}));


/**
 * CORS requests
 */
app.use(cors())


/**
 * Log requests to console
 */
app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})


/**
 * Authentication route
 */
app.use('/api/v1/authentication', authentication);

// Endpoint that require authentication
app.use('/api/v1/users/:userId', tokenChecker);

/**
 * Resource routing
 */
app.use('/api/v1/users', users);


module.exports = app;
