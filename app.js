const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const DB = require("./config/database"); // import file config database
const ProductRouter = require("./routes/ProductRouter");
const UserController = require("./routes/UserRouter");
const OrderRouter = require("./routes/OrderRouter");
require("dotenv").config();
//connect database;
DB.ConfigDB();

const port = process.env.PORT || 8080;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger("dev"));

// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//         limit: "100mb",
//     }),
// );
// app.use(bodyParser.json({ limit: "100mb" }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type",
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.disable("x-powered-by");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api", ProductRouter);
app.use("/api/auth", OrderRouter);
app.use("/api/auth", UserController);

app.listen(port, () => {
    console.log("Server đã chạy trên port: " + port);
});
