var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var passedVariable = req.query.status;
    console.log(req.query);
    if (passedVariable == 1) {
      var result = "Successfully added Associated Person";
    }
  res.render('refugee_dashboard', { title: 'Refugee Dashboard', status: result});
});

module.exports = router;
