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
    paymentOnline: async function (req, res) {
        const { address, products, payment, price } = req.body;
        const { _id } = req.user.data;

        const totalPrice = products.reduce((a, b) => {
            return a + b.newprice * b.soluong;
        }, 0);
        const order = new OrderModel({
            products,
            address,
            payment,
            timeorder: Date.now(),
            status_order: false,
            id_user: _id,
            totalPrice,
        });
        var orderSave = await order.save();
        var ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        var dateFormat = require("dateformat");

        var tmnCode = process.env.vnp_TmnCode;
        var secretKey = process.env.vnp_HashSecret;
        var vnpUrl = process.env.vnp_Url;
        var returnUrl = process.env.vnp_ReturnUrl;
        var date = new Date();
        var createDate = dateFormat(date, "yyyymmddHHmmss");
        var orderId = orderSave._id + "_" + randomstring.generate(5);
        var amount = price;
        var bankCode = "NCB";

        var orderInfo = "Thanh toan san pham";
        var locale = "vn";
        var currCode = "VND";
        var vnp_Params = {};
        vnp_Params["vnp_Version"] = "2";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        // vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        vnp_Params["vnp_BankCode"] = bankCode;

        vnp_Params = sortObject(vnp_Params);

        var querystring = require("qs");
        var signData =
            secretKey + querystring.stringify(vnp_Params, { encode: false });

        var sha256 = require("sha256");

        var secureHash = sha256(signData);

        vnp_Params["vnp_SecureHashType"] = "SHA256";
        vnp_Params["vnp_SecureHash"] = secureHash;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });

        //Neu muon dung Redirect thi dong dong ben duoi
        res.status(200).json({ code: "00", data: vnpUrl });
        //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
        //res.redirect(vnpUrl)
    },
    // handle payment offline
    paymentOffline: async (req, res) => {
        const { address, products, payment } = req.body;
        const { _id } = req.user.data;
        const totalPrice = products.reduce((a, b) => {
            return a + b.newprice * b.soluong;
        }, 0);
        try {
            const order = new OrderModel({
                products,
                address,
                payment,
                timeorder: Date.now(),
                status_order: false,
                id_user: _id,
                totalPrice,
            });
            await order.save();
            return res.json({
                msg: "Đặt hàng thành công ",
                statusCode: 200,
            });
        } catch (err) {
            return res.json({
                msg: "Có lỗi đặt hàng",
                statusCode: 404,
            });
        }
    },
    // handle url return handle oneline
    getReturnOrder: async (req, res) => {
        var vnp_Params = req.query;
        var secureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        var tmnCode = process.env.vnp_TmnCode;
        var secretKey = process.env.vnp_HashSecret;

        var querystring = require("qs");
        var signData =
            secretKey + querystring.stringify(vnp_Params, { encode: false });

        var sha256 = require("sha256");

        var checkSum = sha256(signData);
        var idOrder = req.query.vnp_TxnRef.split("_")[0];
        if (secureHash === checkSum) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            if (vnp_Params.vnp_ResponseCode == "00") {
                var UpdateStatusOrder = await OrderModel.findById(idOrder);
                UpdateStatusOrder.status_order = true;
                await UpdateStatusOrder.save();
                return res.json({
                    code: "00",
                    data: "success",
                });
            } else {
                return res.json({
                    code: "97",
                    data: "failure",
                });
            }
        } else {
            return res.json({
                code: "97",
                data: "failure",
            });
        }
    },
    // get all order,
    getOrder: async (req, res) => {},
    deleteOrder: async (req, res) => {},
    cancelOrder: async (req, res) => {},
    reOrderPayment: async (req, res) => {},
    getAllOrder: async (req, res) => {},
    acceptOrder: async (req, res) => {},
};
