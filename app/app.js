const path = require("path");

const express = require("express");
const app = express();

const authentication = require('./authentication.js');
const users = require('./users.js');
const tokenChecker = require('./tokenChecker.js');

/**
 * Express.js parsing middleware
 */
app.use(express.json());


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
