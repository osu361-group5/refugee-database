/**
 * contains controllers for logging in and logging out
 */
var express = require('express');
var router = express.Router();
var db = require('../db');
var users = require('../db/queries')(db).users;



/**
 *  set a flag for an active session
 */
router.post('/', (req, res, next) => {

    var {associated_name} = req.body;
    var username = req.session.userId;

    users.addAssociatedMember(username,associated_name)
        .catch((err) => {
            var error = new Error(err);
            // user does not exist
            next(error);
        });
});

router.get('/', (req, res, next) => {
  res.render('add_family', { title: 'Add Associated Member' });
});



module.exports = router;