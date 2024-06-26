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
        return res.status(400).json({ error: 'User type must be "Consumer" or "Proprietario"' });
    }

    // Check email
    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
    }

    // Check if user already exists
    if (!req.body.username) {
        return res.status(400).json({ error: 'Username can not be empty' });
    }
    var user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).json({ error: 'Username already registered' });
    }

    // Check password
    if (!req.body.password || typeof req.body.password !== 'string') {
        return res.status(400).json({ error: 'Password must be a non-empty string' });
    }

    // Create new user
    user = new User({
        type: req.body.type,
        username: req.body.username,
        email: req.body.email
    });

    // Create password hash
    const hash = await bcrypt.hash(req.body.password, 10)
    if (hash) {
        user.password = hash;
        user = await user.save();
    } else {
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }

    // Send the link of the new resource
    res.location('/api/v1/users/' + user.id).status(201).send();
});

/*
 * Return user info
 */
router.get('/:userId', async (req, res) => {
    if (req.params.userId === 'me') {
        req.params.userId = req.loggedUser.id;
    }

    // Only Admin can view other users
    if (req.loggedUser.type !== 'Admin' && req.params.userId !== req.loggedUser.id) {
        return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    // Find the user using the mongoose id from its JWT token
    const user = await User.findById(req.params.userId);

    // Return info based on the user type
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
    } else if (user.type === 'Consumer') {
        return res.status(200).json({
            self: '/api/v1/users/' + user.id,
            type: user.type,
            username: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            credibility: user.credibility
        });
    } else if (user.type === 'Proprietario') {
        return res.status(200).json({
            self: '/api/v1/users/' + user.id,
            type: user.type,
            username: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            credit: user.credit
        });
    } else if (user.type === 'Admin') {
        return res.status(200).json({
            self: '/api/v1/users/' + user.id,
            type: user.type,
            username: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth
        });
    }
});

/*
 * Delete user
 */
router.delete('/:userId', async (req, res) => {
    // Only Admin can delete other users
    if (req.loggedUser.type !== 'Admin' && req.params.userId !== req.loggedUser.id) {
        return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    try {
        const result = await User.findByIdAndDelete(req.params.userId);

        if (result) {
            res.status(200).json({ success: true, message: 'User deleted.' });
        } else {
            res.status(404).json({ success: false, message: `No user found with id ${req.params.userId}` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
