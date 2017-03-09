/*
    This should only contain routes necessary for testing.  Not for production.
 */


var express = require('express');
var setupDb = require('../db/util');

var router = express.Router();
var sqlFile = '../db/schema.sql';


router.get('/reset-db', (req, res) => {
    setupDb();
    res.render('plain', {
        content: 'database resetted go to home: <a href="/">here</a>',
        title: 'database reset'
    })
});

module.exports = router;
