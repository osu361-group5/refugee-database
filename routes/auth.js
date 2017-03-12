/**
 * contains controllers for logging in and logging out
 */
var express = require('express');
var router = express.Router();
var db = require('../db');
var users = require('../db/queries')(db).users;
var crypto = require('../crypto');



/**
 *  set a flag for an active session
 */
router.post('/login', (req, res, next) => {
    var {username, password} = req.body;

    users.findUserByUsername(username)
        .then((data) => {
            if (crypto.verifyPassword(data.password_hash, password)) {
                req.session.userId = data.id;
                req.session.isLoggedIn = true;
                req.session.username = data.username;
                res.redirect('/');
            } else {
                next();
            }
        })
        .catch((err) => {
            var error = new Error(err);
            // user does not exist
            next();
        });
});

module.exports = router;