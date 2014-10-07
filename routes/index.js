// Standard Express setup and routing.
var express = require('express');
var router = express.Router();

// Hookups to consolidate separated controller logic.
var regRoute = require('../controllers/registrationController');
var loginRoute = require('../controllers/loginController');
var courseRoute = require('../controllers/courseController');

// Public exports

router.get('/', function(req, res) {
  res.render('index', { 
    title: 'Express', 
    error: req.flash('error'), 
    success: req.flash('success') 
  });
});

router.register = regRoute;

router.login = loginRoute;
router.logout = loginRoute;

router.courses = courseRoute;

module.exports = router;
