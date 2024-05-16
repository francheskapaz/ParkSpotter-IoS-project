const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ParkingSchema = new Schema({
    name: String,
    fee: Number,
    maxStop: Number,
    open: Boolean,
    coordinates: { nord: Number, est: Number },
    nParkingSpaces: Number,
    vehicleType: String,
    nFree: Number,
    reservations: [{
        timeStart: { type: Date, default: Date.now },
        timeEnd: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Parking', ParkingSchema);
