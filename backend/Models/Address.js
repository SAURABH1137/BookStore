const mongoose = require('mongoose');
const { Schema } = mongoose;

const BooksSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    house: {
        type: String,
        required: true
    },
    apartment: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gmail: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Address', BooksSchema);