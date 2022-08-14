const mongoose = require('mongoose');
const { Schema } = mongoose;

const BooksSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    cardno: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    cardhname: {
        type: String,
        required: true
    },
    checkbox :{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Card', BooksSchema);