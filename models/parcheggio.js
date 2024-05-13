import { readJSON } from "../utils.js"
const parcheggi = readJSON('./routes/parcheggi.json')

export class ParcheggioModel{
  static async getAll(){
    return parcheggi // Returning all parking lots
  }

  static async getById({id}){
    const parcheggio = parcheggi.find(parcheggio => parcheggio.id === id)
    return parcheggio // Returning the found parking lot
  }

  static async create (input) {
    const newParcheggio = {
      ...input  // Creating a new parking lot with the provided input
    }
    parcheggi.push(newParcheggio) // Adding the new parking lot to the parking lot array
    return newParcheggio // Returning the newly created parking lot
  }

  static async delete ({id}) {
    const parcheggioIndex = parcheggi.findIndex(parcheggio => parcheggio.id === id) // Finding the index of the parking lot to delete
    if (parcheggioIndex === -1) return false
    parcheggi.splice(parcheggioIndex, 1) // Removing the parking lot from the array
    return true // Returning true indicating successful deletion
  }
 
  static async update ({id, input}){
    const parcheggioIndex = parcheggi.findIndex(parcheggio => parcheggio.id === id) // Finding the index of the parking lot to update.
    if (parcheggioIndex === -1) return false
    // Updating the parking lot with the provided input
    parcheggi[parcheggioIndex] = {
        ...parcheggi[parcheggioIndex],
        ...input
    }
    return parcheggi[parcheggioIndex] // Returning the updated parking lot
  }


}