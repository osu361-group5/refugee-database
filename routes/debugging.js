/*
    This should only contain routes necessary for testing.  Not for production.
 */

var express = require('express');
var setupDb = require('../db/util');
var db = require('../db');

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

module.exports = router;
