const path = require("path");

const express = require("express");
const app = express();


/**
 * Serve static files for the front-end
 */
app.use('/', express.static('static'));


module.exports = app;
