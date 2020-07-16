const express = require('express');
const router = express.Router();
const Token = require('../../library/Token');
const nodemailer = require('nodemailer');

router.all('/', async (req, res, next) => {

    let data = {
        func: 'request'
    }

    let email = req.body.email;

    // Verify email is on the whitelist
    if (email.indexOf('@pernod-ricard.com') > -1 || email.indexOf('@tonnec.com') > -1 || email.indexOf('@k2-asia.cn') > -1 ||
        email.indexOf('@blackbox-interactive.com') > -1 || email.indexOf('yackixp@163.com') > -1 || email.indexOf('@blackbox-i.cn') > -1) {
        console.log('valid')
    } else {
        console.log('invalid');
        data.result = 'fail';
        data.error = 'invalid';
        sendResponse(res, data);
        return false;
    }


    let token = new Token({email: email, used: false});
    console.log(token);

    // Generate 6 digit code
    let code = (Math.random() * 1000000) - 1;
    code = code.toFixed(0);
    let padString = "00000";
    code = padString.substr(0, 6 - code.length) + code;
    token.code = code;

    // Email
    let transporter = nodemailer.createTransport({
        host: "mail.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true, // StartTLS parameter
        auth: {
            user: 'kickstartmeeting@pernod-ricard.com', // generated ethereal user
            pass: 'Pernod2020', // generated ethereal password
        },
        // host: "smtp.exmail.qq.com",
        // port: 465,
        // secure: true, // true for 465, false for other ports
        // auth: {
        //     user: 'admin@blackbox-interactive.com', // email account can send up to 1500 single-recipient emails
        //     pass: 'QR!pL491mn',
        // },
    });

    await transporter.sendMail({
            // from: '"PRC Kickstart" <admin@blackbox-interactive.com>', // sender address
            from: '"PRC Kickstart" <kickstartmeeting@pernod-ricard.com>', // sender address
            to: email, // list of receivers
            subject: "PRC Kick Start Meeting Verification Code", // Subject line
            text: "This is your verification code to the Kick Start Meeting: " + "\r\n" +
                "这是你的员工大会验证码：" + "\r\n" + "\r\n" + code, // plain text body
            html: '<div style="margin-bottom: 10px">' + (req.body.ln === 'en' ? "This is your verification code to the Kick Start Meeting: " : "这是你的员工大会验证码：") + code + "</div>" +
                '<div>' + (req.body.ln === 'en' ? 'Please use the code to log in within 30 minutes. You will remain logged in for the next 14 days.' : '请在30分钟内使用该验证码进行登录，该验证码将会在您成功登陆后14天内有效。') + '</div>', // html body
        }, (err, res) => {
            if (err) console.log(err);
            else {
                console.log(res);
                data.result = 'success';
            }
        }
    );


    // Save token
    await token.save();
    data.result = 'success';
    data.token = token;

    sendResponse(res, data);

});

function sendResponse(res, data) {
    res.set('Content-Type', 'application/json');
    res.send(data);
}

module.exports = router;
