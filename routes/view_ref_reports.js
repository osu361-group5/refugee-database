var express = require('express');
var router = express.Router();
var db = require('../db');
var ngo = require('../db/queries')(db).ngo;

router.post('/', function(req, res, next) {
	ngo.getReports(req.body.id)
		.then((data)=> {
			var context = {};
			context.results = data;
			context.name = req.body.name;
			res.render('view_ref_reports', context);
		})
		.catch((err) => {
			console.log('ERROR: ',err);
			var error = new Error(err);
			next(error);
		});
});

module.exports = router;
