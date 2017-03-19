var db = require('../db');
var users = require('../db/queries')(db).users;
var crypto = require('../crypto');

// where should the user be taken to after they login?
var loginRedirect = '/auth/dashboard';

module.exports.logout = function(req, res, next) {
    if (!req.session.isLoggedIn) {
        req.session.loginError = "Must be logged-in to do that";
        return res.redirect('/auth/login');
    }

    delete req.session.userId;
    delete req.session.isLoggedIn;
    delete req.session.username;
    res.redirect('/auth/login');
};

module.exports.redirectToDashboard = function redirectToCorrectDashboard(req, res, next) {
    if (!req.session.isLoggedIn) {
        res.redirect('/auth/login');
    } else {
        var {username, userId} = req.session;
        users.getUserType(userId)
            .then((data) => {
                if (data.user_type == 'ngo') {
                    res.redirect('/ngo_dash');
                } else {
                    res.redirect('/refugee_dashboard');
                }
            })
            .catch((err) => {
                var error = new Error(err);
                return next(error);
            })
    }
};

module.exports.loginForm = function(req, res, next) {
    var context = {};
    if (req.session.isLoggedIn) {
        return res.redirect('/auth/dashboard');
    }

    if (req.session.loginError) {
        context.error = req.session.loginError;
        delete req.session.loginError;
    }
    res.render('login', context);
};

/** sets loggedIn flag */
module.exports.login = function(req, res, next) {
    var {username, password} = req.body;
    var userData;

    if (req.session.isLoggedIn) {
        return res.redirect('/auth/dashboard');
    }

    if (username && password) {
        users.findUserByUsername(username)
            .then((data) => {
                if (data) {
                    userData = data;
                    return crypto.verifyPassword(data.password_hash, password);
                }
                else {
                    var error = new Error("incorrect login credentials");
                    error.status = 403;
                    throw error;
                }
            })
            .then((passwordCorrect) => {
                if (passwordCorrect) {
                    req.session.userId = userData.id;
                    req.session.isLoggedIn = true;
                    req.session.username = userData.username;
                    res.redirect(loginRedirect);
                } else {
                    var error = new Error("incorrect login credentials");
                    error.status = 403;
                    throw error;
                }
            })
            .catch((err) => {
                // user does not exist
                if (!err.status || err.status >= 500) {
                    return next(err);
                }
                res.status(err.status).render('login', {error: 'incorrect login credentials'});
            });
    } else {
        //res.status(400).render('/auth/login', {error: 'incomplete form'});
        res.render('login');
    }
};