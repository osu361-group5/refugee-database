var express = require('express');
var router = express.Router();
var db = require('../db');
var ngo = require('../db/queries')(db).ngo;

//var id = req.session.userId;
var id = 1;

router.get('/', function(req, res, next) {
	ngo.findRefugeeAssociatedWithNGOByName(id,req.query.refugee_name)
		.then((data)=> {
			var context = {};
			context.results = data;
			if(data[0] != null)
				res.render('search_refugees', context);
			else
				res.send('Refugee Not Found');
		})
		.catch((err) => {
                        console.log('ERROR: ',err);
                        var error = new Error(err);
                        next(error);
                });
});

module.exports = router;
