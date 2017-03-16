var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('ngo_dash', { title: 'NGO Dashboard', user: req.session.username });
});

module.exports = router;
