const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required:true
    },
    gender :{
        type: String,
        enum : ['Male','Female','Other','none'],
        default:'none'
    },
    img_URL:{
        type:String,
        default:'user.png'
    },
    date :{
        type:Date,
        default:Date.now
    },
    status :{
        type: String,
        enum : ['Active','Deactive'],
        default:'Active',
        required:true
    },
});

const User = mongoose.model('user',UserSchema);
module.exports = User