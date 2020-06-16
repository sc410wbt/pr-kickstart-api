let express = require('express');
let router = express.Router();
const nodemailer = require("nodemailer");

router.all(['/'], async (req, res, next) => {

    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //     host: "mail.gandi.net",
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //         user: 'info@mulias.com', // generated ethereal user
    //         pass: 'Mulias052015', // generated ethereal password
    //     },
    // });

    let transporter = nodemailer.createTransport({
        host: "mail.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true, // StartTLS parameter
        auth: {
            user: 'kickstartmeeting@pernod-ricard.com', // generated ethereal user
            pass: 'Pernod2020', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"Mulias" <info@mulias.com>', // sender address
        to: "sun.chen@tonnec.com", // list of receivers
        subject: "Welcome to Mulias!", // Subject line
        text: "Thanks for subscribing to Mulias", // plain text body
        html: "<b>Thanks for subscribing to Mulias</b>", // html body
    })
        .then()
        .catch(err => {
            console.log(err);
        });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    res.set('Content-Type', 'application/json');
    res.send(info);

});

module.exports = router;
