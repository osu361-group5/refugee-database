var express = require('express');
var router = express.Router();
//var db = require('../db');
var refugees = require('../db/queries').refugees;

router.get('/view_refugees', function(req, res) {
	refugees.getRefugeesByAssociationWithNGO('markus').then((data)=>res.render('view_refugees', data));
});
/*router.get('/view_refugees/:username', function(req, res) {
	refugees.getRefugeesByAssociationWithNGO(req.params.username).then((data)=>res.render('view_refugees', data));
});*/

router.get('/', function(req, res, next) {
	res.render('view_refugees', { title: 'NGO: Associated Refugees ' });
});


module.exports = router;
