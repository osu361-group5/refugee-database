var express = require('express');
var router = express.Router();
var db = require('../db');
var refugees = require('../db/queries')(db).refugees;

router.get('/search_refugees/:ngo_name/:refugee_name', function(req, res) {
	refugees.getRefugeesByAssociationWithNGO(req.params.ngo_name,req.params.refugee_name)
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
