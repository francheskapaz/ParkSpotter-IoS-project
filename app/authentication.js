const express = require('express');
const router = express.Router();
const User = require('./models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcrypt'); // used for password hashing

/*
 * Authenticate the user and generate a new token
 */
router.post('', async function(req, res) {

    // Search the user in the database
    let user = await User.findOne({ username: req.body.username }).exec()

    // User not found or password is incorrect
    if (!user) {
        return res.json({ success: false, message: 'User not found' });
    }

    const passwordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!passwordCorrect) {
        return res.json({ success: false, message: 'Wrong password' });
    }

    // User authenticated -> create a token
    var payload = {
        id: user.id,
        email: user.email,
        user_type: user.type
    }
    var options = { expiresIn: 86400 } // expires in 24 hours
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        id: user._id,
        self: "api/v1/" + user._id
    });
});

function validatePassword(password, hash) {
    bcrypt.compare(password, hash)
}

module.exports = router;
