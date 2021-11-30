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
    registerUser: async (req, res) => {
        const { username, password, phone, email } = req.body;

        const checkUserName = await UserModel.find({ username });
        const checkEmail = await UserModel.find({ email });
        if (checkUserName.length > 0) {
            return res.json({
                statusCode: 404,
                msg: "Tên tài khoản đã được đăng ký",
            });
        }
        if (checkEmail.length > 0) {
            return res.json({
                statusCode: 404,
                msg: "Email đã được đăng ký",
            });
        }
        if (username.length <= 6 || password.length <= 6) {
            return res.json({
                statusCode: 404,
                msg: "Mật khẩu và tài khoản phải nhiều hơn 6 kí tự",
            });
        }
        const HashPassword = bcrypt.hashSync(password, saltRounds);
        const NewUser = new UserModel({
            username,
            password: HashPassword,
            name: username,
            phone,
            email,
            role: "USER",
            image: "https://cdn.shortpixel.ai/client/q_glossy,ret_img,w_632,h_316/https://gocsuckhoe.com/wp-content/uploads/2020/09/avatar-facebook-632x316.jpg",
            verificationcode: randomstring.generate(16),
            enable: false,
        });
        try {
            const user = await NewUser.save();
            sendmail.VerifyEmail(
                email,
                url_verifyEmail + user.verificationcode
            );
            return res.json({
                statusCode: 200,
                msg: "Tạo tài khoản thành công",
            });
        } catch {
            err;
        }
        {
            return res.json({
                statusCode: 404,
                msg: err,
            });
        }
    },
    registerUserFacebook: async (req, res) => {
        const { username, password, name, email, image } = req.body;
        const checkEmail = await UserModel.find({
            email,
        });

        if (checkEmail.length > 0) {
            if (checkEmail[0].username == username) {
                return res.json({
                    statusCode: 200,
                    msg: "Thành công",
                });
            } else {
                return res.json({
                    statusCode: 404,
                    msg: "Email đã được đăng ký ",
                });
            }
        }
        const HashPassword = bcrypt.hashSync(password, saltRounds);
        const NewUser = new UserModel({
            username,
            password: HashPassword,
            name,
            email,
            role: "USER",
            image,
            enable: true,
        });
        try {
            const user = await NewUser.save();
            return res.json({
                statusCode: 200,
                msg: "Tạo tài khoản thành công",
            });
        } catch {
            err;
        }
        {
            return res.json({
                statusCode: 404,
                msg: err,
            });
        }
    },
    forgetPassword: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({
                email,
            });
            if (user) {
                user.forgotpassword = await jwt.generateToken(
                    user,
                    SECRETKEY,
                    TIME_SECRET
                );
                await user.save();
                sendmail.ChangePassword(
                    email,
                    url_changePassord + user.forgotpassword
                );
                return res.json({
                    status: 200,
                    msg: "Vui lòng đăng nhập vào gmail để thay đổi password",
                });
            } else {
                return res.json({
                    status: 404,
                    msg: "Tài khoản email chưa được đăng ký",
                });
            }
        } catch (err) {
            return res.json({
                status: 404,
                msg: "Có lỗi trong quá trình ! vui lòng thử lại",
            });
        }
    },
    checkTokenValid: async (req, res) => {
        const { token } = req.params;
        try {
            const UserJwt = await jwt.verifyToken(token, SECRETKEY);
            return res.json({
                status: 200,
            });
        } catch (err) {
            return res.json({
                status: 404,
            });
        }
    },
    forgotChangePassword: async (req, res) => {
        const { id } = req.params;
        const { password } = req.body;

        try {
            const UserJwt = await jwt.verifyToken(id, SECRETKEY);
            const user = await UserModel.findById(UserJwt.data._id);
            const HashPassword = bcrypt.hashSync(password, saltRounds);
            user.password = HashPassword;
            await user.save();
            return res.json({
                status: 200,
            });
        } catch (err) {
            return res.json({
                status: 500,
                msg: err,
            });
        }
    },
    loginUser: async (req, res) => {
        const { username, password } = req.body;
        try {
            const checkUsername = await UserModel.findOne({
                username,
            });
            if (!checkUsername.enable) {
                return res.json({
                    statusCode: 404,
                    msg: "Tài khoản chưa được kích hoạt vui lòng đăng nhập vào gmail để kích hoạt",
                });
            }
            if (bcrypt.compareSync(password, checkUsername.password)) {
                const token = await jwt.generateToken(
                    checkUsername,
                    SECRETKEY,
                    TIME_SECRET
                );
                return res.json({
                    statusCode: 200,
                    jwt: token,
                    msg: "Đăng nhập thành công",
                });
            } else {
                return res.json({
                    statusCode: 404,
                    msg: "Mật khẩu không chính xác! vui lòng nhập lại mật khẩu",
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                statusCode: 403,
                msg: "Tài khoản không tồn tại",
            });
        }
    },
    verifyCode: async (req, res) => {
        const { code } = req.params;
        try {
            const user = await UserModel.findOne({
                verificationcode: code,
            });

            user.enable = true;
            await user.save();
            res.send("<h1 style='text-align:center'>Kích hoạt thành công</h1>");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getUser: async (req, res) => {
        const { _id } = req.user.data;
        try {
            const user = await UserModel.findById(_id);
            res.json({
                username: user.username,
                name: user.name,
                phone: user.phone,
                email: user.email,
                image: user.image,
                role: user.role,
                ngaysinh: user.ngaysinh,
                sex: user.sex,
                enable: user.enable,
                id: user.id,
                statusCode: 200,
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    loginUser: async (req, res) => {
        const {username,password} = req.body;
        try{
            const checkUsername = await UserModel.findOne({
                username
            });
            if(!checkUsername.enable){
                return res.json({
                    statusCode : 404,
                    msg : "Tài khoản chưa được kích hoạt vui lòng đăng nhập vào gmail để kích hoạt"
                })
            }
            if(bcrypt.compareSync(password,checkUsername.password)){
                const token = await jwt.generateToken(checkUsername,SECRETKEY,TIME_SECRET);
                return res.json({
                    statusCode : 200,
                    jwt : token,
                    msg : "Đăng nhập thành công",
                })
            }
            else{
                return res.json({
                    statusCode : 404,
                    msg : "Mật khẩu không chính xác! vui lòng nhập lại mật khẩu",
                })
            }
        }
        catch(err){
            console.log(err);
            res.json({
                statusCode: 403,
                msg : "Tài khoản không tồn tại"
            })
        }
    },
    updateUser: async(req,res)=>{
        const { _id } = req.user.data;
        const {phone,sex,ngaysinh,currentPassword,newPassword,name} = req.body;
        const user = await UserModel.findById(_id);
        if(req.file){
            user.image="http://localhost:8080/image/"+req.file.originalname;
        }
        if(currentPassword||newPassword){
            if(bcrypt.compareSync(currentPassword,user.password)){
                user.password=bcrypt.hashSync(newPassword,saltRounds);
            }
            else{
                return res.json({
                    msg:"Password hiện tại chưa đúng",
                    statusCode:404,                   
                })   
            }
        }
        user.phone=phone;
        user.sex=sex;
        user.ngaysinh=ngaysinh;
        user.name=name;
        user.save();
        return res.json({
            msg:"Cập nhật tài khoản thành công",
            statusCode:200,
        })
    },
    getAllUser : async(req,res)=>{
        return res.json(await UserModel.find({}));
    },
    deleteUser : async (req,res)=>{
        const {id} = req.body;
        try{
            await UserModel.findByIdAndRemove(id);
            return res.json("Thành công");
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
};
