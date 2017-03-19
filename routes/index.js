var express = require('express');
var router = express.Router();
var db = require('../db');
var {users, refugees, ngo} = require('../db/queries')(db);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Refugee Database' });
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  var {username, password, email,name,organization} = req.body;
  var userType = req.body['user-type'];

    if (!(username && password && email && userType)) {
        return res.render("register", {"error": "Please make sure you have completed the form correctly."});
    }

  users.createUser(username, password, email)
      .then((data) => {
          if (userType === "refugee") {
              return refugees.create(data.id,name);
          } else {
              return ngo.create(data.id, organization);
          }
      })
      .then(() => {
          res.redirect("/auth/login");
      })
      .catch((err) => {
          var error = new Error('not able to fulfill the request');
          return next(error);
      });
});

module.exports = router;
