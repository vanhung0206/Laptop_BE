const mongoose = require("mongoose");
const {Schema} = mongoose;
const commentModel = require('./commentModel')
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
    createdBy:{
        type:Date,
        default:Date.now
    }
})
const Comment = new Schema({

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
const ProductModel = new Schema({
    title : {
        type : String,
    },
    oldprice : {
        type : Number,
    },
    newprice : {
        type : Number,
    },
    image : {
        type : String,
    },
    ListImage : {
        type : Array,
    },
    category : {
        type : String,
    },
    content : {
        type : String, 
        
    },
    quantity : {
        type : Number , 
    },
    type : {
        type : String , 
    },
    comment : [Comment]
})

module.exports = mongoose.model("Products",ProductModel,"Products");