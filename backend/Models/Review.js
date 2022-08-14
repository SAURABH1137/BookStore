const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    email :{
        type:String,
        required:true,
    },
    pname:{
        type:String,
        required:true,
    },
    message :{
        type:String,
        required:true,
    },
    rating :{
        type:Number,
        required:true
    },
    date :{
        type:Date,
        default:Date.now
    },
    status :{
        type: String,
        enum : ['Active','Deactive'],
        default:'Active',
    },
});

const User = mongoose.model('review',ReviewSchema);
module.exports = User