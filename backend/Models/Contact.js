const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartsSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['feedback', 'query'],
        default: 'feedback'
    },
    message: {
        type: String,
        required: true
    },
    Answer: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Contact', CartsSchema);