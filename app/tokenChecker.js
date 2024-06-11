const jwt = require('jsonwebtoken');

const tokenChecker = function(req, res, next) {

    var token = req.headers['x-access-token'];

    // Token not found
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided.'
        });
    }

    // Verify the token
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) {
            res.status(403).json({
                success: false,
                message: 'Token verification failed'
            });
        } else {
            // User authenticated, save in req object for use in other routes
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;
