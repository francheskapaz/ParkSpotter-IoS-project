const { Router } = require('express');
const { validateParcheggio, validatePartialParcheggio } = require('../scheme/parcheggioSchema.js');
const  Parking  = require('./models/parking.js');

const parcheggiRouter = Router()

parcheggiRouter.get('/', async (req, res) => {
    try {
        res.json(await Parking.find()); 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}) 

parcheggiRouter.get('/:id', async (req, res) => {
    try {
        const foundParcheggio = await Parking.findById(req.params.id); 
        if (foundParcheggio) {
            return res.json(foundParcheggio);
        } else {
            res.status(404).json({ message: 'Parcheggio not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
 }) 


parcheggiRouter.post('/',  async (req, res) => {
    console.log('Received data:', req.body);
    const result = validateParcheggio(req.body);
    if (!result.success) {
        console.log('Validation error:', result.error.message);
        return res.status(400).json({ error: result.error.message });
    }
    try {
        const parking = new Parking(req.body);
        await parking.save();
        res.status(201).json(parking.toObject());
    } catch (error) {
        console.error('Internal server error:', error); 
        res.status(500).json({ error: 'Internal server error' });
    }
}) 

parcheggiRouter.patch('/:id', async (req, res) => {
    try {
        const result = validatePartialParcheggio(req.body);
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const updateParcheggio = await Parking.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
        return res.json(updateParcheggio);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}) 

parcheggiRouter.delete('/:id',  async (req, res) => {
    try {
        const result = await Parking.findByIdAndDelete(req.params.id); 
        if (result) {
            return res.json({ message: 'Parcheggio deleted' });
        } else {
            return res.status(404).json({ message: 'Parcheggio not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}) 

module.exports =  parcheggiRouter ;