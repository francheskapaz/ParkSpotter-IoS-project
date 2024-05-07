const express = require('express');
const router = express.Router();
const User = require('./models/user'); // get our mongoose model
const bcrypt = require('bcrypt'); // used for password hashing


/*
 * Register a new user
 */
router.post('', async function(req, res) {
    // Check user type
    if (!isValidUserType(req.body.type)) {
        return res.status(400).json({error: 'User type must be "Consumer" or "Proprietario"'});
    }

    // Check email
    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({error: 'The field "email" must be a non-empty string, in email format'});
    }

    // Check if user already exists
    if (!req.body.username) {
        return res.status(400).json({error: 'Username can not be empty'});
    }
    var user = await User.findOne({username: req.body.username});
    if (user) {
        return res.status(400).json({error: 'Username already registered'});
    }

    // Check password
    if (!req.body.password || typeof req.body.password !== 'string') {
        return res.status(400).json({error: 'Wrong password'});
    }

    // Create new user
    user = new User({
        type: req.body.type,
        username: req.body.username,
        email: req.body.email,
    });

    // Create password hash
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .then(() => {
            user = user.save();
        });

    // Send the link of the new resource
    res.location('/api/v1/users/' + user._id).status(201).send();
});

/*
 * Return user info
 */
router.get('/:userId', async(req, res) => {
    if (req.params.userId === 'me') {
        return res.status(301).json({
            success: true,
            resource: '/api/v1/users/' + req.loggedUser.id
        });
    }

    // Only Admin can view other users
    if (req.loggedUser.type !== 'Admin' && req.params.userId !== req.loggedUser.id) {
        console.log(req.loggedUser.id, req.params.userId)
        return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    // Find the user using the mongoose _id from its JWT token
    let user = await User.findById(req.params.userId);

    // Return info based on the user type
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
    } else if (user.type === 'Consumer') {
        return res.status(200).json({
            self: '/api/v1/users/' + user._id,
            type: user.type,
            username: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            credibility: user.credibility
        });
    } else if (user.type === 'Proprietario') {
        return res.status(200).json({
            self: '/api/v1/users/' + user._id,
            type: user.type,
            username: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            credit: user.credit
        });
    } else if (user.type === 'Admin') {
        return res.status(200).json({
            self: '/api/v1/users/' + user._id,
            type: user.type,
            username: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth
        });
    }
});

function isValidUserType(type) {
    return ['Consumer', 'Proprietario'].indexOf(type) !== -1;
}

function isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


module.exports = router;
