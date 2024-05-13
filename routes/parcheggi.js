import { Router } from 'express'
import { ParcheggioController } from '../controllers/parcheggi.js'

export const parcheggiRouter = Router()

// Defining routes for handling different HTTP methods on the parking lots endpoint
parcheggiRouter.get('/', ParcheggioController.getAll) // Route for getting all parking lots
parcheggiRouter.get('/:id', ParcheggioController.getById) // Route for getting a parking lot by ID
parcheggiRouter.post('/', ParcheggioController.create) // Route for creating a new parking lot
parcheggiRouter.patch('/:id', ParcheggioController.update) // Route for updating a parking lot by ID
parcheggiRouter.delete('/:id', ParcheggioController.delete) // Route for deleting a parking lot by ID

