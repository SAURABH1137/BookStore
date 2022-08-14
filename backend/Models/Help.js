const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartsSchema = new Schema({
    email :{
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    Answer: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    status :{
        type: String,
        default:'Active'
    },
});

module.exports = mongoose.model('Help', CartsSchema);