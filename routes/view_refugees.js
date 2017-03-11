var express = require('express');
var router = express.Router();
var db = require('../db');
var refugees = require('queries')(db).refugees;

router.get('/', function(req, res) {
	refugees.getRefugeesByAssociationWithNGO('markus').then((data)=>res.render('view_refugees', results=data));
});
/*router.get('/view_refugees/:username', function(req, res) {
	refugees.getRefugeesByAssociationWithNGO(req.params.username).then((data)=>res.render('view_refugees', data));
});*/

module.exports = router;
