var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var DB = require("./config/database"); // import file config database
const ProductRouter = require("./routes/ProductRouter");
const UserController = require("./routes/UserRouter");
const OrderRouter = require("./routes/OrderRouter");
require("dotenv").config();
//connect database;
DB.ConfigDB();
var app = express();

const port = process.env.PORT;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api", ProductRouter);
app.use("/api/auth", OrderRouter);
app.use("/api/auth", UserController);

app.listen(port, () => {
    console.log("Server đã chạy trên port: " + port);
});
