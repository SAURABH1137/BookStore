const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartsSchema = new Schema({
    uid: {
        type: String,
        required: true,
    },
    pname: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Buy', 'Cart','wait'],
        default: 'Cart'
    }
});

module.exports = mongoose.model('cart', CartsSchema);