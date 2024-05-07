var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    type: String,        // Consumer, Proprietario, Admin
    username: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    credibility: Number, // Utente Consumer
    credit: Number       // Utente Proprietario
}));

