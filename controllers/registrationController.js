// Imports

var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = mongoose.model('User');

// Private helpers

var validateEmail = function(email) {
  return /[\w]+@[\w]+\.[\w]+/.test(email);
}

var validatePass = function(pass) {
  return pass.match(/[a-z]+/) && pass.match(/[A-Z]+/) && pass.match(/[0-9]+/) && pass.length >= 8;
}

var validateUser = function(user) {
  return /[\w]{3,16}/.test(user);
}

router.post('/register', function(req, res) {
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
            bcrypt.hash(data.pass, null, null, function(err, hash) {
              new User({
                username: data.user.toLowerCase(),
                password: hash,
                email: data.email
              }).save(function(err, obj){
                if (err){ 
                  console.error(err); 
                  req.flash('error', 'DB blew up.');
                  res.redirect('/');
                }
                else{
                  req.flash('success', 'Successfully created an account!');
                  res.redirect('/');
                }
              });
            })
          }
        });
      }
    });
  }
}) ;

// Public exports

module.exports = router;