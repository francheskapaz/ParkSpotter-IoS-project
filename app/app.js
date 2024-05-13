import express, { json } from 'express' 
import { corsMiddleware} from '../middlewares/cors.js'
import { parcheggiRouter } from '../routes/parcheggi.js'



const app = express()
app.use(json()) // Adding the json middleware to parse incoming request bodies as JSON
 

app.use(corsMiddleware()) // Using the cors middleware to enable Cross-Origin Resource Sharing (CORS)
app.use('/apiParcheggi/parcheggi', parcheggiRouter) // Mounting the parcheggiRouter to handle requests for the '/apiParcheggi/parcheggi' endpoint

const PORT = process.env.PORT || 8080 // Defining the port number for the server to listen on, defaulting to 8080 if not provided through an environment variable

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)

})
