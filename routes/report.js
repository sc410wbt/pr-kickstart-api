const express = require('express');
const router = express.Router();
const Token = require('../library/Token');

router.all('/', async (req, res, next) => {

    let unique = '';

    let list = await Token.find().exec();
    for (let token of list) {
        let email = token.email;
        email = email.toLowerCase();
        // if (unique.indexOf(email) === -1) {
            unique += (
                '<tr>' +
                    '<td>' + email + '</td>' +
                    '<td>' + token._id.getTimestamp() + '</td>' +
                '</tr>'
            );
        // }
    }

    unique = '<table>' + unique + '</table>';

    res.set('Content-Type', 'text/html');
    res.send(unique.toString());

});

module.exports = router;
