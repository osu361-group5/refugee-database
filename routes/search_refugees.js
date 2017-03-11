var express = require('express');
var router = express.Router();
var db = require('../db');
var ngo = require('../db/queries')(db).ngo;

router.get('/', function(req, res) {
	ngo.getRefugeesByAssociationWithNGO(req.query.ngo_name,req.query.refugee_name)
		.then((data)=> {
			res.render('search_refugees', context=data);
			done();
		})
		.catch((err) => {
			console.log('ERROR: ',err);
			res.render('search_refugees', null);
			done();
		});
});

module.exports = router;
