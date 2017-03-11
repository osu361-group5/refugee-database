/**
 * contains controllers for logging in and logging out
 */
var express = require('express');
var router = express.Router();
var db = require('../db');


/**
 *  set a flag for an active session
 */
router.post('/login', (req, res, next) => {
    var {username, password} = req.body;
    if (!(username && password)) {
        var err = new Error("form incomplete");
        return next(err);
    }

    if (username === 'test' && password === 'test') {
        res.redirect('/')
    }

});

module.exports = router;