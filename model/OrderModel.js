const mongoose = require("mongoose");
const {Schema} = mongoose;
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
    soluong : {
        type : Number , 
    },
    type : {
        type : String , 
    },
})
const OrderModel = new Schema({
   products : [ProductModel],
   address : {
       type : String,
   },
   totalPrice : {
       type : Number,
   },
   payment : {
       type : String,
   },
   timeorder : {
        type : Date,
   },
   cancelreason : {
       type : String,
   },
   status_order : {
       type : Boolean,
   },
   id_user : {
       type : mongoose.Types.ObjectId,
       ref : "Users"
   }
})

module.exports = mongoose.model("Orders",OrderModel,"Orders");