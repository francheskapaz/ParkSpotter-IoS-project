const { Router } = require('express');
const { validateParcheggio, validatePartialParcheggio } = require('../scheme/parcheggioSchema.js');
const  Parking  = require('./models/parking.js');
const z = require('zod'); 

const parcheggiRouter = Router()


const parcheggioSchemeValidation = z.object({
    name: z.string({
        invalid_type_error: 'name must be a string',
        required_error: 'name is required'
    }),

    fee: z.number({
        invalid_type_error: 'fee must be a number',
        required_error: 'fee is required'
    }),

    maxStop: z.number({
        required_error: 'maxStop is required',
        invalid_type_error: 'maxStop must be a number'
    }),

    open: z.boolean({
        invalid_type_error: 'open must be a boolean',
        required_error: 'open is required'
    }),
    coordinates: z.object({
        nord: z.number({
            invalid_type_error: 'nord must be a number',
            required_error: 'nord is required'
        }),
        est: z.number({
            invalid_type_error: 'est must be a number',
            required_error: 'est is required'
        })
    }),

    nParkingSpaces: z.number({
        required_error: 'nParkingSpaces is required'
    }).int({
        invalid_type_error: 'nParkingSpaces must be an integer'
    }),

    vehicleType: z.string({
        invalid_type_error: 'vehicleType must be a string',
        required_error: 'vehicleType is required'
    }),

    nFree: z.number({
        required_error: 'nFree is required'
    }).int({
        invalid_type_error: 'nFree must be an integer'
    }),

    reservations: z.array(z.object({
        timeStart: z.date({
            invalid_type_error: 'timeStart must be a valid date'
        }),
        timeEnd: z.date({
            invalid_type_error: 'timeEnd must be a valid date'
        })
    })).optional()

});



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

    // Validar los datos del estacionamiento utilizando el esquema de validación
    try {
        const validationResult = parcheggioSchemeValidation.parse(req.body);

        // Crear un nuevo objeto de estacionamiento utilizando los datos validados
        const parking = new Parking(validationResult);

        // Guardar el estacionamiento en la base de datos
        await parking.save();

        // Responder con el estacionamiento creado
        res.status(201).json(parking.toObject());
    } catch (error) {
        // Manejar los errores de validación de Zod
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(e => e.message);
            console.log('Validation error:', errorMessages);
            return res.status(400).json({ error: errorMessages });
        }
        // Manejar otros errores internos del servidor
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