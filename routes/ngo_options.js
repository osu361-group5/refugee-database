var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('ngo_options', { title: 'NGO Options' });
});

module.exports = router;
