/**
 * contains controllers for logging in and logging out
 */
var express = require('express');
var router = express.Router();
var controllers = require('../controllers/auth');



router.post('/logout', controllers.logout);

router.get('/login', controllers.loginForm);

router.post('/login', controllers.login);

router.get('/dashboard', controllers.redirectToDashboard);


module.exports = router;