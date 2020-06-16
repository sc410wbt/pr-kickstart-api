const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    let session = req.session;
    session.count++;

    let data = {
        hello: 'world',
        session: req.session
    }

    res.set('Content-Type', 'application/json');
    res.send({data});

});

module.exports = router;
