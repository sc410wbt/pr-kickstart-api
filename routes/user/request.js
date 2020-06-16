const express = require('express');
const router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {

    let data = {
        func: 'request'
    }

    let email = req.body.email;

    // Verify email is on the whitelist


    // Generate 6 digit code

    let code = (Math.random() * 1000000) - 1;
    code = code.toFixed(0);
    let padString = "00000";
    code = padString.substr(0, 6 - code.length) + code;
    data.code = code;

    res.set('Content-Type', 'application/json');
    res.send({data});

});

module.exports = router;
