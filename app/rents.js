const express = require('express');
const router = express.Router();
const Rent = require('./models/rent');
const Parking = require('./models/parking');
const { validateParcheggio, validatePartialParcheggio } = require('../scheme/parcheggioSchema.js'); // Importar funciones de validación desde el archivo de esquema


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

    let rent = new Rent({
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
        const result = await Rent.findByIdAndDelete(req.params.rentId);
        if (result) {
            return res.json(result);
        } else {
            return res.status(404).json({ message: 'Rent not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
