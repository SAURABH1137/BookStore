const mongoose = require('mongoose');
const { Schema } = mongoose;

const BooksSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    title: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    keyword: {
        type: String,
        default: "General"
    },
    type: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    variants:{
        type: String,
        enum: ['audio', 'text'],
        default: 'text'
    },
    AudioLink:{
        type:String,
        default:'No'
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'none'
    }
});

module.exports = mongoose.model('Books', BooksSchema);