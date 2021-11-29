const OrderModel = require("../model/OrderModel");
require("dotenv").config();
const randomstring = require("randomstring");
const ProductModel = require("../model/ProductModel");
function sortObject(o) {
    var sorted = {},
        key,
        a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}
module.exports = {
    //handle payment online

    paymentOnline: async function (req, res) {},
    // handle payment offline
    paymentOffline: async (req, res) => {},
    // handle url return handle oneline
    getReturnOrder: async (req, res) => {},
    // get all order,
    getOrder: async (req, res) => {},
    deleteOrder: async (req, res) => {},
    cancelOrder: async (req, res) => {},
    reOrderPayment: async (req, res) => {},
    getAllOrder: async (req, res) => {},
    acceptOrder: async (req, res) => {},
};
