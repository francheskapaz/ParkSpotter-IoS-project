const express = require('express') 
const app = express()
const parcheggi = require('./parcheggi.json')
const cors = require('cors') 
const {validateParcheggio, validatePartialParcheggio} = require('./scheme/parcheggio.js')
app.use(express.json())
 

app.use(cors({
  origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:63394',
        `http://localhost:${PORT}`
      ]

      if (ACCEPTED_ORIGINS.includes(origin)){
          return callback(null, true)
      }
      if (!origin){
          return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/apiParcheggi/parcheggi', (req, res) => {
  res.json(parcheggi)
})

app.get('/apiParcheggi/parcheggi/:id', (req, res) => {
  const { id } = req.params
  const foundParcheggio = parcheggi.find(parcheggio => parcheggio.id === id)
  if (foundParcheggio) {
    return res.json (foundParcheggio)
  } else {
    res.status(404).json({ message: 'Parcheggio not found'})
  }
})

app.post('/apiParcheggi/parcheggi', (req, res) => {
  const result = validateParcheggio(req.body)
  if (result.error){
    res.status(400).json( { error: JSON.parse(result.error.message)})
  }
  // in basi di dati
  const newParcheggio = {
    ...result.data
  }
  parcheggi.push(newParcheggio) //non è REST, da sistemare dopo
  res.status(201).json(newParcheggio)
})

app.patch('/apiParcheggi/parcheggi/:id', (req, res) => {
  const result = validatePartialParcheggio(req.body)
  if (!result.success){
    return res.status(400).json({error: JSON.parse(result.error.message)})
  }
  const { id } = req.params
  const parcheggioIndex = parcheggi.findIndex(parcheggio => parcheggio.id === id)

  if (parcheggioIndex === -1){
    return res.status(404).json({ message: 'Parcheggio not found'})
  }

  const updateParcheggio = {
    ...parcheggi[parcheggioIndex],
    ...result.data
  }
  parcheggi[parcheggioIndex] = updateParcheggio
  return res.json(updateParcheggio)
})

app.delete('/apiParcheggi/parcheggi/:id', (req, res) => {
  const { id } = req.params
  const parcheggioIndex = parcheggi.findIndex(parcheggio => parcheggio.id === id)

  if (parcheggioIndex === -1){
    return res.status(404).json({ message: 'Parcheggio not found'})
  }

  parcheggi.splice(parcheggioIndex, 1)
  return res.json({ message: 'parcheggio deleted'})
})


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
