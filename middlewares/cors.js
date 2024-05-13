import cors from 'cors' // Importing the cors middleware
/*
export const corsMiddleware = () => cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
          'http://localhost:63394',
          `http://localhost:8080`
        ]
  
        if (ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true)
        }
        if (!origin){
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    }
  })
  */

// Exporting a middleware function named corsMiddleware, which allows requests from any origin
export const corsMiddleware = () => cors({
    origin: '*',
});