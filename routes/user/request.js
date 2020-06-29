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
    if (email.indexOf('@pernod-ricard.com') > -1 || email.indexOf('@tonnec.com') > -1 ||
        email.indexOf('@blackbox-interactive.com') > -1 || email.indexOf('@blackbox-i.cn') > -1) {
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
            subject: "PRC Kick Start Meeting Access Code", // Subject line
            text: "Here's your access code to the meeting" + "\r\n" +
                "这是你的会议验证" + "\r\n" + "\r\n" + code, // plain text body
            html: "<div>" + (req.body.ln === 'en' ? "Here's your access code to the meeting" : "这是你的会议验证码") + "</div>" +
                "<div><b>" + code + "</b></div>", // html body
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
