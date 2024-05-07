const express = require('express') 
const app = express()
const utenteregistratoJSON = require('./utenteregistrato.json')

const PORT = process.env.PORT ?? 8080

app.get('/utente/utenteregistrato', (req, res) => {
    res.json(utenteregistratoJSON)
})

app.post('/utente', (req, res) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const data = JSON.parse(body)
      data.timestamp = Date.now()
      res.status(201).json(data) 
    })
  })

  app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
  })

  app.listen(PORT, () => {
    console.log('server listening on port http://localhost:8080')
  })
