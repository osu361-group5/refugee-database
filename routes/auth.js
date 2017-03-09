/**
 * contains controllers for logging in and logging out
 */
var express = require('express');
var router = express.Router();
var db = require('../db');


/**
 *  set a flag for an active session
 */
router.post('/login', (req, res) => {
    var {username, password} = req.form;
    if (!(username && password)) {
        var err = new Error("form incomplete");
        return res.next(err);
    }


});

module.exports = router;