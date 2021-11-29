const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("../helpers/jwt");
var randomstring = require("randomstring");
const sendmail = require("../helpers/sendmail");
require("dotenv").config();

const { TIME_SECRET, SECRETKEY, url_verifyEmail, url_changePassord } =
    process.env;

module.exports = {
    registerUser: async (req, res) => {},
    registerUserFacebook: async (req, res) => {},
    forgetPassword: async (req, res) => {},
    checkTokenValid: async (req, res) => {},
    forgotChangePassword: async (req, res) => {},
    loginUser: async (req, res) => {},
    verifyCode: async (req, res) => {},
    getUser: async (req, res) => {},
    updateUser: async (req, res) => {},
    getAllUser: async (req, res) => {},
    deleteUser: async (req, res) => {},
};
