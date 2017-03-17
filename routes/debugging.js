/*
    This should only contain routes necessary for testing.  Not for production.
 */

var express = require('express');
var setupDb = require('../db/util');
var db = require('../db');
var queries = require('../db/queries')(db);

var router = express.Router();
var sqlFile = 'db/schema.sql';


router.get('/reset-db', (req, res, next) => {
    setupDb(sqlFile, db)
        .then(() => {
            res.render('plain', {
                content: 'database resetted go to home: <a href="/">here</a>',
                title: 'database reset'
            });
        })
        .catch((err) => next(new Error(err)))
});

router.get('/set-refugee-session', (req, res, next) => {
    if (req.session.username)  {
        req.session.destroy();
        res.redirect('/debugging/set-refugee-session');     // recreate session
    }
    req.session.username = queries.testData.testUser.username;
    req.session.userId = queries.testData.testUser.id;
    req.session.isLoggedIn = true;
    res.redirect('/refugee_dashboard');
});


router.get('/set-ngo-session', (req, res, next) => {
    if (req.session.username)  {
        req.session.destroy();
        res.redirect('/debugging/set-ngo-session');     // recreate session
    }
    req.session.username = queries.testData.testNGOUser.username;
    req.session.userId = queries.testData.testNGOUser.id;
    req.session.isLoggedIn = true;
    res.redirect('/ngo_dash');
});

router.get('/destroy-session', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;
