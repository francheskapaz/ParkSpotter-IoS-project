const express = require('express');
const router = express.Router();
const Rent = require('./models/rent');
const Parking = require('./models/parking');


/*
 * Get parkings
 */
router.get('', async function(req, res) {
    const rents = await Rent.find({ userId: req.loggedUser.id });

    return res.json(rents);
});


/*
 * Add new parking to rent
 */
router.post('', async function(req, res) {
    // Check authorization
    if (req.loggedUser.user_type !== 'Admin' && req.loggedUser.user_type !== 'Proprietario') {
        return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    if (!req.body.parkingId) {
        return res.status(400).json({ success: false, message: 'parkingId is required' });
    }
    // Check if the parking is already rented
    let rent = await Rent.findOne({ parkingId: req.body.parkingId });
    if (rent) {
        return res.status(400).json({ error: 'Rent already registered' });
    }

    rent = new Rent({
        userId: req.loggedUser.id,
        parkingId: req.body.parkingId,
        approved: false
    });

    rent = await rent.save();
    if (rent) {
        return res.json({ success: true, message: 'Rent saved successfully' });
    }
});


/*
 * Delete rent
 */
router.delete('/:rentId', async function(req, res) {
    // Check authorization
    if (req.loggedUser.user_type !== 'Admin' && req.loggedUser.user_type !== 'Proprietario') {
        return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    if (!req.params.rentId) {
        return res.status(400).json({ success: false, message: 'rentId is required' });
    }

    try {
        const rent = await Rent.findById(req.params.rentId);
        if (rent) {
            if (rent.userId !== req.loggedUser.id) {
                return res.status(403).json({ success: false, message: 'Permission denied' });
            }
            const result = await Rent.findByIdAndDelete(req.params.rentId);
            return res.json(result);
        } else {
            return res.status(404).json({ success: false, message: 'Rent not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
