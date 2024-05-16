const { Router } = require('express');
const { validateParcheggio, validatePartialParcheggio } = require('../scheme/parcheggioSchema.js'); // Importar funciones de validación desde el archivo de esquema
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
    try {
        const result = validateParcheggio(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const newParcheggio = await Parking.create(req.body); 
        res.status(201).json(newParcheggio);
    } catch (error) {
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

module.exports = parcheggiRouter;
