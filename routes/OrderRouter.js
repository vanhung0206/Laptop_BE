const express = require("express");
const Router = express.Router();
const OrderController = require("../controllers/OrderController")
const Authentication= require("../middleware/Auth");


Router.post("/payment/create",Authentication.isUserValid,OrderController.paymentOnline);  //get product by search or get all product
Router.post("/order",Authentication.isUserValid,OrderController.paymentOffline);  //get product by search or get all product
Router.get("/order",Authentication.isUserValid,OrderController.getOrder);  //get product by search or get all product
Router.get("/payment/return_vnp",Authentication.isUserValid,OrderController.getReturnOrder);
Router.delete("/order",Authentication.isUserValid,OrderController.deleteOrder);
Router.post("/order/cancel",Authentication.isUserValid,OrderController.cancelOrder);
Router.post("/payment/ReOrder",Authentication.isUserValid,OrderController.reOrderPayment); 
Router.get("/orders",Authentication.isAdmin,OrderController.getAllOrder);
Router.post("/order/accept",Authentication.isAdmin,OrderController.acceptOrder);
module.exports=Router;