const express = require('express');
const router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {

    let data = {
        func: 'login'
    }

    res.set('Content-Type', 'application/json');
    res.send({data});

});

module.exports = router;
