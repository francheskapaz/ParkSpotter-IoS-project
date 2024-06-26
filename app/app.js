const path = require('path');
const cors = require('cors')
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const authentication = require('./authentication.js');
const users = require('./users.js');
const users_v2 = require('./users-v2.js');
const rents = require('./rents.js');
const tokenChecker = require('./tokenChecker.js');
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


/**
 * Authentication route
 */
app.use('/api/v1/authentication', authentication);

// Endpoint that require authentication
app.use('/api/v1/users/:userId', tokenChecker);
app.use('/api/v2/users/:userId', tokenChecker);
app.get('/api/v2/users', tokenChecker);
app.put('/api/v1/parkings', tokenChecker);
app.use('/api/v2/rents', tokenChecker);

/**
 * Resource routing
 */
app.use('/api/v1/users', users);
app.use('/api/v2/users', users_v2);
app.use('/api/v1/parkings', parcheggiRouter);
app.use('/api/v2/rents', rents);
app.use('/api/v1/feedback', feedbackRouter) 

module.exports = app;






