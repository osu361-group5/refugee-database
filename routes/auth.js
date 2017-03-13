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
    var userData;
    users.findUserByUsername(username)
        .then((data) => {
            if (data) {
                userData = data;
                return crypto.verifyPassword(data.password_hash, password);
            }
            else
                return false;
        })
        .then((passwordCorrect) => {
            if (passwordCorrect) {
                req.session.userId = userData.id;
                req.session.isLoggedIn = true;
                req.session.username = userData.username;
                res.redirect('/');
            } else {
                next();
            }
        })
        .catch((err) => {
            var error = new Error(err);
            // user does not exist
            next(error);
        });
});

module.exports = router;