var express = require('express');
var router = express.Router();
var refugees = require('../db/queries').RefugeesDAO;

refugees.getRefugeesByAssociatedNGO('ngo_guy').then(function(data){
	router.get('/', function(req, res, next) {
		res.render('view_refugees', { title: 'NGO: Associated Refugees ', data });
	});
});

module.exports = router;
