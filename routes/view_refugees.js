var express = require('express');
var router = express.Router();
var refugees = require('../db/queries').refugees;

refugees.getRefugeesByAssociationWithNGO('markus')
.then(data => {
	console.log(data);
})
.catch(error => {
	console.log(error);
});

router.get('/', function(req, res, next) {
	res.render('view_refugees', { title: 'NGO: Associated Refugees ' });
});


module.exports = router;
