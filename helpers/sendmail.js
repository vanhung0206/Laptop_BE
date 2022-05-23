const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
require("dotenv").config();

const { email_username, email_password } = process.env;

async function VerifyEmail(emailUser, url) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: email_username, // generated ethereal user
            pass: email_password, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"F8 Shop" <web.bocau.duathu@gmail.com>', // sender address
        to: emailUser,
        subject: "Xác minh địa chỉ email", // Subject line
        html: `
            <div style="max-width: 700px; margin:40px auto; border: 1px solid #ddd; padding: 50px 20px; font-size: 110%; border-radius: 10px;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">CHÀO MỪNG BẠN ĐẾN VỚI G8 Shop</h2>
            <p>Xin chúc mừng! Bạn sắp bắt đầu sử dụng Laptop . Chỉ cần nhấp vào nút bên dưới để xác thực địa chỉ email của bạn.</p>
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px auto; display: block; border-radius: 20px; width: 260px; text-align: center;">Verify</a>
            </div>
        `, // html body
    });
}
async function ChangePassword(emailUser, url) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: email_username, // generated ethereal user
            pass: email_password, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"F8 Shop" <web.bocau.duathu@gmail.com>', // sender address
        to: emailUser,
        subject: "Thay đổi mật khẩu", // Subject line
        html: `
            <div style="max-width: 700px; margin:40px auto; border: 1px solid #ddd; padding: 50px 20px; font-size: 110%; border-radius: 10px;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">THAY ĐỔI MẬT KHẨU VỚI G8 Shop</h2>
            <p>Nhấn vào link dưới đây để thay đổi mật khẩu của bạn</p>
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px auto; display: block; border-radius: 20px; width: 260px; text-align: center;">Verify</a>
            </div>
        `, // html body
    });
}

module.exports = {
    VerifyEmail,
    ChangePassword,
};
