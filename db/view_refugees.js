var express = require('express');
var router = express.Router();
/*
var pgp = require('pg-promise');


var cn = {
        host: 'localhost';
        port: '';
        database: '';
        user: 'postgres';
        password: '';
};

var db = pgp(cn);
*/

/* GET all refugee data for NGO. */
router.get('/', function(req, res, next) {
  var context = {};
  /*query the database, then render results*/
  /*
        db.any('SELECT u.username, rep.creation_date, rep.description, rep.location_name FROM user AS u
				INNER JOIN refugee AS ref ON ref.user_id = u.id
				INNER JOIN report AS rep ON rep.refugee_id = ref.id
				ORDER BY u.username DESC;', [true])
            .then(data => {
                console.log('DATA:', data); // print data;
				context = data;
				res.render('view_refugees', context);
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
            })
            .finally(() => {
                pgp.end();
            });
  */
  res.render('view_refugees', context);
});

module.exports = router;
