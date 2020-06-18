const express = require('express');
const router = express.Router();

router.all('/', async (req, res, next) => {

    delete req.session.token;

    let data = {
        result: 'success'
    };

    res.set('Content-Type', 'application/json');
    res.send(data);

});

module.exports = router;
