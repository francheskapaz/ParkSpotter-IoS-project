require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('Connesso al database MongoDB...');
    } catch (err) {
      console.error('Impossibile connettersi al database...', err);
    }
};

module.exports = { connectDB };
