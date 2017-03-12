var express = require('express');
var router = express.Router();
var db = require('../db');
var ngo = require('../db/queries')(db).ngo;

router.get('/', function(req, res) {
	ngo.getRefugeesByAssociationWithNGO(req.session.userID)
		.then((data)=> {
			res.render('view_refugees', context=data);
			done();
		})
		.catch((err) => {
			console.log('ERROR: ',err);
			res.render('view_refugees', null);
			done();
		});
});

module.exports = router;
