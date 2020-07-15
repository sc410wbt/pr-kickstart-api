const express = require('express');
const router = express.Router();
const Token = require('../library/Token');

/* GET home page. */
router.all('/', async (req, res, next) => {

    let session = req.session;
    session.count++;

    // Get email for continuing logins without emails saved in session
    if (req.session.token && !req.session.email) {
        // Get the email to save to session
        console.log('finding email');
        let token = await Token.findById(req.session.token).exec();
        console.log(token.email);
        if (token.email) req.session.email = token.email;
    }

    let data = {
        hello: 'world',
        session: req.session
    }

    res.set('Content-Type', 'application/json');
    res.send(data);

});

module.exports = router;
