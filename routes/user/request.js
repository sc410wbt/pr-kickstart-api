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
    let token = new Token({email: email, used: false});

    // Generate 6 digit code
    let code = (Math.random() * 1000000) - 1;
    code = code.toFixed(0);
    let padString = "00000";
    code = padString.substr(0, 6 - code.length) + code;
    token.code = code;

    // Email
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true, // StartTLS parameter
        auth: {
            user: 'kickstartmeeting@pernod-ricard.com', // generated ethereal user
            pass: 'Pernod2020', // generated ethereal password
        },
    //     host: "smtp.exmail.qq.com",
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //         user: 'admin@blackbox-interactive.com', // email account can send up to 1500 single-recipient emails
    //         pass: 'QR!pL491mn',
    //     },
    });

    await transporter.sendMail({
        from: '"PRC TEST" <admin@blackbox-interactive.com>', // sender address
        to: email, // list of receivers
        subject: "PRC Kickstart Meeting Confirmation Code", // Subject line
        text: "Heres the code: " + code, // plain text body
        html: "<b>Heres the code: " + code + "</b>", // html body
    }, (err, res) => {
        if (err) console.log(err);
        else {
            console.log(res);
            data.result = 'success';
        }
    });


    // Save token
    await token.save();
    data.result = 'success';
    data.token = token;

    res.set('Content-Type', 'application/json');
    console.log('sending');
    res.send(data);

});

module.exports = router;
