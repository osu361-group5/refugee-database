var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var passedVariable = req.query.status;
    if (passedVariable == 1) {
      var result = "Successfully added Associated Person";
    } else if (passedVariable == 0) {
      var result = "Functionality not yet implemented.";
    }

  res.render('refugee_dashboard', { title: 'Refugee Dashboard', status: result});
});

module.exports = router;
