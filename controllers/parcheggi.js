import { ParcheggioModel } from '../models/parcheggio.js'
import { validateParcheggio, validatePartialParcheggio } from '../scheme/parcheggioSchema.js' // Importing validation functions from a local file

export class ParcheggioController {
    static async getAll(req, res){
        const parcheggi = await ParcheggioModel.getAll(); // Retrieving all parcheggi from the database (yet to configure) using the ParcheggioModel
        res.json(parcheggi)
    }

    static async getById(req, res){
       const { id } = req.params
        const foundParcheggio = await ParcheggioModel.getById({id})
        if (foundParcheggio) {
        return res.json(foundParcheggio)
        } else {
        res.status(404).json({ message: 'Parcheggio not found'})
        }
    }

    static async create (req, res){
        const result = validateParcheggio(req.body)
        if (result.error){
          return res.status(400).json( { error: JSON.parse(result.error.message)})
        }
        const newParcheggio = await ParcheggioModel.create({ input: result.data})
        res.status(201).json(newParcheggio)
    }

    static async delete (req, res){
        const { id } = req.params
        const result = await ParcheggioModel.delete({id})
        if (result === false){
          return res.status(404).json({ message: 'Parcheggio not found'})
        }
        return res.json({ message: 'parcheggio deleted'})
    }

    static async update (req, res) {
        const result = validatePartialParcheggio(req.body)
        if (!result.success){
          return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        const { id } = req.params
        const updateParcheggio = await ParcheggioModel.update({id, input: result.data})
        return res.json(updateParcheggio)
    }
}