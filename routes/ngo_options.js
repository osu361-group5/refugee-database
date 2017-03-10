var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('ngo_options', { title: 'NGO Options' });
});

module.exports = router;
