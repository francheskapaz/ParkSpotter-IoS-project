var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Parking', new Schema({
    name: String,
    fee: Number,
    maxStop: Number,
    open: Boolean,
    coordinates: {nord: Number, est: Number},
    nParkingSpaces: Number,
    vehicleType: String,
    nFree: Number,
    reservations: [{
        timeStart: {type: Date, default: Date.now},
        timeEnd: {type: Date, default: Date.now}
    }]
}));

