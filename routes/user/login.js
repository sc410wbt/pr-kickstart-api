const express = require('express');
const router = express.Router();
const Token = require('../../library/Token');

router.all('/', async (req, res, next) => {

    let code = req.body.code;
    let email = req.body.email;
    let token = await Token.findOne({code: code, email: email}).exec();

    let data = {
        func: 'login',
        code: code,
        token: token
    }

    // Check if token found
    if (!token) {
        data.result = 'fail';
        data.error = 'invalid'
        sendResult(res, data)
        return false;
    }

    // Check if used
    if (token.used === true) {
        data.result = 'fail';
        data.error = 'used';
        sendResult(res, data);
        return false;
    }

    // Check if expired
    let created = token._id.getTimestamp();
    let now = new Date();
    let diff = Math.abs((now - created) / 1000 / 60); // In minutes
    if (diff > 30) {
        data.result = 'fail';
        data.error = 'expired';
        data.created = created;
        data.now = now;
        sendResult(res, data);
        return false;
    }

    // Save token as used
    token.used = true;
    token.save();

    // Session save
    req.session.token = token._id

    data.result = 'success';
    sendResult(res, data);

});

function sendResult(res, data) {
    res.set('Content-Type', 'application/json');
    res.send(data);
}

module.exports = router;
