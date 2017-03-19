/**
 * contains controllers for logging in and logging out
 */
var express = require('express');
var router = express.Router();
var db = require('../db');
var users = require('../db/queries')(db).users;
var refugees = require('../db/queries')(db).refugees;



/**
 *  set a flag for an active session
 */
router.post('/', (req, res, next) => {

    var {associated_name} = req.body;
    var user_session_id = req.session.userId;
    var userID, refugeeID;

    // get user id from username
    users.findById(user_session_id)
        .then((data) => {
            userID = data.id
            console.log('find by id stuff indside' + userID);
        })
        .then(() => {
            // get refugee id from user id
            return refugees.findByUserId(userID)
        })
        .then((data) => {
            var refugeeID = data.id;
            console.log('find refugee by id ' + refugeeID);
        })
        .then(() => {
            // pass refugee id to addAssociatedMember
            users.addAssociatedMember(refugeeID,associated_name)
            res.redirect('/refugee_dashboard?status=1');
        })
        .catch((err) => {
             var error = new Error(err);
             // user does not exist
             next(error);
        });
});

router.get('/', (req, res, next) => {
  //users.createUser('igor','pwd','email');
  res.render('add_family', { title: 'Add Associated Member' });
});

module.exports = router;
