var express = require('express');
var router = express.Router();
var db = require('../db');
var ngo = require('../db/queries')(db).ngo;

router.get('/', function(req, res, next) {
	ngo.searchForRefugee(req.session.userId,req.query.refugee_name)
		.then((data)=> {
                        console.log(data[0]);
			console.log(req.query.refugee_name);
			console.log(req.session.userId);
			var context = {};
			context.results = data;
			if(data.length != 0)
				res.render('view_refugees', context);
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
