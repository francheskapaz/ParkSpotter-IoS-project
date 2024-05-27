const { Router } = require('express');
const { validateParcheggio, validatePartialParcheggio } = require('../scheme/parcheggioSchema.js');
const  Parking  = require('./models/parking.js');
const z = require('zod'); 

const parcheggiRouter = Router()


// Get all parkings
parcheggiRouter.get('/', async (req, res) => {
    try {
        res.json(await Parking.find()); 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}) 

// Get a specific parking
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


 // Create a new parking
parcheggiRouter.post('/',  async (req, res) => {
    console.log('Received data:', req.body);
    try{
        const result = validatePartialParcheggio(req.body);
        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)});
        }
        const createParcheggio = await Parking.create(req.body);
        return res.status(201).json(createParcheggio);
    } catch (error){
        res.status(500).json({error: 'Internal server error'});
    }
}) 

// Update an existing parking
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

// Delete an existing parking
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