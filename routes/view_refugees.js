var express = require('express');
var router = express.Router();
var db = require('../db');
var refugees = require('../db/queries')(db).refugees;

router.get('/', function(req, res) {
	refugees.getRefugeesByAssociationWithNGO('markus')
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
