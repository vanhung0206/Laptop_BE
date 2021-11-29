const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserModel = new Schema({
    _id:{
        type:Schema.Types.ObjectId
    },
    name : {
        type : String,
    },
    image : {
        type : String,
    },
})

const reply = new Schema({
    user : UserModel
    ,
    content : {
        type : String,
    },
})
const commentModel = new Schema({

    user : UserModel
    ,
    content : {
        type : String,
    },
    start : {
        type : Number,
    },
    reply :[reply],
    createdBy:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("commentModel",commentModel,"commentModel");