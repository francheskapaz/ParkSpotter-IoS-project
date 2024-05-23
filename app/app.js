const path = require('path');
const cors = require('cors')
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const authentication = require('./authentication.js');
const users = require('./users.js');
const tokenChecker = require('./tokenChecker.js');
const parcheggiRouter = require('./parcheggi.js');

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


/**
 * Authentication route
 */
app.use('/api/v1/authentication', authentication);

// Endpoint that require authentication
app.use('/api/v1/users/:userId', tokenChecker);
app.put('/api/v1/parkings', tokenChecker);

/**
 * Resource routing
 */
app.use('/api/v1/users', users);
app.use('/api/v1/parkings', parcheggiRouter);


module.exports = app;
