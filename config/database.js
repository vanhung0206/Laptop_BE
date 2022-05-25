const mongoose = require("mongoose");
require("dotenv").config();

const mongo_url = process.env.MONGODB_URI;
const ConfigDB = () => {
    mongoose
        .connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true
        })
        .then((res) => {
            console.log("Connecting database");
        })
        .catch((err) => {
            console.log(err);
        });
    mongoose.connection.on("connected", () => {
        console.log("Connect success");
    });
};

module.exports = { ConfigDB };
