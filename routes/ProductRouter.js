const express = require("express");
const Router = express.Router();
const ProductController = require("../controllers/ProductController");
const Authentication = require("../middleware/Auth");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/image/product");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage });
var productUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "listimage", maxCount: 8 },
]);

Router.get("/products", ProductController.getProduct); //get product by search or get all product
Router.get(
    "/admin/products",
    Authentication.isAdmin,
    ProductController.getAllProduct,
); //get product by search or get all product
Router.get("/products/:category", ProductController.getProductByCategory); // get product by category
Router.get("/detailproducts/:id", ProductController.getProductById); // get product by ID
Router.post(
    "/detailproducts/:id/comment",
    Authentication.isUserValid,
    ProductController.postComment,
);
Router.get("/detailproducts/:id/comment", ProductController.getComment);
Router.post(
    "/detailproducts/:id/reply/:idcomment",
    Authentication.isUserValid,
    ProductController.postReply,
);
// Router.delete("/product",Authentication.isAdmin,ProductController.deleteProduct);
Router.post(
    "/product",
    productUpload,
    Authentication.isAdmin,
    ProductController.createProduct,
);
Router.put(
    "/product",
    productUpload,
    Authentication.isAdmin,
    ProductController.updateProduct,
);

module.exports = Router;
