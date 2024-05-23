const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RentSchema = new Schema({
    userId: String,
    parkingId: String
});

module.exports = mongoose.model('Rent', RentSchema);
