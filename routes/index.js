var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var mongoose = require('mongoose');
var User = mongoose.model('User');



// Private helper functions

var validateEmail = function(email) {
  return /[\w]+@[\w]+\.[\w]+/.test(email);
}

var validatePass = function(pass) {
  return pass.match(/[a-z]+/) && pass.match(/[A-Z]+/) && pass.match(/[0-9]+/) && pass.length >= 8;
}

var validateUser = function(user) {
  return /[\w]{3,16}/.test(user);
}

var loginPost = function(req, res) {
  var data = req.body;
  User.findOne({
    username: data.user.toLowerCase(),
    password: data.pass
  }, function(err, user) {
    if(err) {
      req.flash('error', err);
    }
    else if(!user){
      req.flash('error', 'User with that username and password combination not found.');
    }
    else {
      console.log(user);
      req.flash('success', 'Successfully logged in!');
    }
    res.redirect('/');
  })
}

var createPost = function(req, res) {
  var data = req.body;
  if(data.pass != data['confirm-pass']){
    req.flash('error', "Your passwords don't match.");
    res.redirect('/');
  }
  else if(data.email != data['confirm-email']){
    req.flash('error', "Your emails don't match.");
    res.redirect('/');
  }
  else if(!validateUser(data.user)){
    req.flash('error', "Your username must be at least 3 characters and at most 16 characters long.");
    res.redirect('/');
  }
  else if(!validatePass(data.pass)){
    req.flash('error', "You must have a password with at least one uppercase letter, one lowercase letter, one number, and is greater than 8 characters.");
    res.redirect('/');
  }
  else if(!validateEmail(data.email)){
    req.flash('error', "Please supply a valid email.");
    res.redirect('/');
  }
  else {
    User.findOne({
      email: data.email
    }, function(err, user) {
      if(user){
        req.flash('error', 'User with that email already exists.');
        res.redirect('/');
      }
      else {
        User.findOne({
          username: data.user.toLowerCase()
        }, function(err, user) {
          if(user){
            req.flash('error', 'User with that username already exists.');
            res.redirect('/');
          }
          else {
            new User({
              username: data.user.toLowerCase(),
              password: data.pass,
              email: data.email
            }).save(function(err, obj){
              console.log('Here');
              if (err){ 
                console.error(err); 
                req.flash('error', 'DB blew up.');
                res.redirect('/');
              }
              else{
                console.log('Boom');
                req.flash('success', 'Successfully created an account!');
                res.redirect('/');
              }
            });
          }
        });
      }
    });
  }
}

// Public exports

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
    title: 'Express', 
    error: req.flash('error'), 
    success: req.flash('success') 
  });
});

router.create = {'POST': createPost}

router.login = {'POST': loginPost}

module.exports = router;
