const mongoose = require('mongoose');
const { Schema } = mongoose

const FeedbackSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parking_id: { type: Schema.Types.ObjectId, ref: 'Parking', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);