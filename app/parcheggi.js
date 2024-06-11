const express = require('express');
const router = express.Router();
const Parking  = require('./models/parking.js')
const Feedback = require('./models/feedback.js')

// Create a new parking
router.post('/', async (req, res) => {
    const { name, fee, maxStop, open, coordinates, nParkingSpaces, vehicleType, nFree, reservations, averageScore } = req.body;

    // Validation of required fields
    const requiredFields = ['name', 'fee', 'maxStop', 'open', 'coordinates', 'nParkingSpaces', 'vehicleType', 'nFree', 'averageScore'];
    const missingFields = requiredFields.filter(field => req.body[field] === undefined);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Validation of data types
    if (typeof coordinates !== 'object' || typeof coordinates.nord !== 'number' || typeof coordinates.est !== 'number') {
        return res.status(400).json({ error: 'Invalid coordinates format' });
    }

    try {
        const newParking = new Parking({  
            name, fee, maxStop, open, coordinates, nParkingSpaces, vehicleType, nFree, 
            reservations: reservations || [], //Default value if not provided
            averageScore: averageScore || 0 //Default value if not provided
        });
        await newParking.save();
        res.status(201).json({ message: 'Parking created successfully', parking: newParking});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

// Update an existing parking
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, fee, maxStop, open, coordinates, nParkingSpaces, vehicleType, nFree, reservations, averageScore } = req.body;

    try {
        const updateParking = await Parking.findByIdAndUpdate(
            id,
            { name, fee, maxStop, open, coordinates, nParkingSpaces, vehicleType, nFree, reservations, averageScore },
            { new: true, runValidators: true }
        );

        if(!updateParking) {
            return res.status(404).json({ message: 'Parking not found' });
        }
        res.json({ message: 'Parking updated successfully', parking: updateParking });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

// Get all parkings
router.get('/', async (req, res) => {
    try {
        res.json(await Parking.find());
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific parking
router.get('/:id', async (req, res) => {    
    try {
        const foundParcheggio = await Parking.findById(req.params.id);
        if (foundParcheggio) {
            return res.json(foundParcheggio);
        } else {
            res.status(404).json({ message: 'Parking not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
 });

 // Get all feedbacks for a specific parking

router.get('/:id/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ parking_id: req.params.id });
        if (feedbacks.length > 0) {
            return res.json(feedbacks);
        } else {
            res.status(404).json({ message: 'Feedbacks not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a parking
router.delete('/:id', async (req, res) => {
    try{
        const deleteParking = await Parking.findByIdAndDelete(req.params.id);
        if (deleteParking) {
            return res.json({ message: 'Parking deleted' });
        } else {        
            res.status(404).json({ message: 'Parking not found' });
        }
    } catch (error) {        
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports =  router;