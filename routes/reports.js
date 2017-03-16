var express = require('express');
var router = express.Router();
var db = require('../db');
var refugees = require('../db/queries')(db).refugees;

router.get('/', function(req, res, next) {
//	if(req.session.loggedIn)
	res.send('<h1>All Reports for Refugee</h1>');
});

router.get('/create', function(req, res, next) {
	res.render('create_report');
});

router.post('/create', function(req, res, next) {
	var { location_name, latitude, longitude, description } = req.body;
        refugees.addReport(req.session.userId, location_name, longitude, latitude, description)
            .then((data) => {
                res.redirect('/refugee_dashboard');
            })
            .catch((err) => {
                var error = new Error('Internal Service Error');
		return next(error);
            });
});

module.exports = router;
