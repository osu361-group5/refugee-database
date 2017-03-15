var express = require('express');
var router = express.Router();
var db = require('../db');
var ngo = require('../db/queries')(db).ngo;

router.post('/', function(req, res) {
	var userId = req.session.userId;
               
	addReport(userId, req.body.location_name, req.body.longitude, req.body.latitude, req.body.description)
	.then((data)=> {
		done();
	})
	.catch((err) => {
		console.log('ERROR: ',err);
		done();
	});
});

router.get('/', function(req, res) {
	res.render('create_report');
});

module.exports = router;
