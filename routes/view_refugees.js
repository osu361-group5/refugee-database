var express = require('express');
var router = express.Router();
var db = require('../db');
var ngo = require('../db/queries')(db).ngo;

router.get('/', function(req, res, next) {
	ngo.getRefugeesByAssociationWithNGO(req.session.userId)
		.then((data)=> {
			res.render('view_refugees', context=data);
		})
		.catch((err) => {
			console.log('ERROR: ',err);
			var error = new Error(err);
			next(error);
		});
});

module.exports = router;
