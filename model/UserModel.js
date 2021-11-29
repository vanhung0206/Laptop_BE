const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserModel = new Schema({
    username : {
        type : String,
        require : true,
        unique : true,
    },
    password : {
        type : String,
        require :true,
    },
    name : {
        type : String,
    },
    email : {
        type : String,
    },
    image : {
        type : String,
    },
    role : {
        type : String,
    },
    enable : {
        type : Boolean,
    },
    verificationcode : {
        type : String,
    },
    forgotpassword : {
        type : String,
    },
    ngaysinh : {
        type : String,
    },
    sex : {
        type : String,
    },
    phone:{
        type: String,
    }
})

module.exports = mongoose.model("Users",UserModel,"Users");

