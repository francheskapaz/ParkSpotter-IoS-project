const mongoose = require('mongoose');
const { Schema } = mongoose

//The averageScore field was included to store the average of the feedback scores given by users

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
    }],
    averageScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('Parking', ParkingSchema);

