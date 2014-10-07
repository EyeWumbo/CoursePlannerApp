var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/login', function(req, res) {

  if(req.cookies.user){
    req.flash('error', 'You\'re already logged in.');
    res.redirect('/');
    return;
  }

  console.log(req.cookies);

  var data = req.body;
  User.findOne({
    username: data.user.toLowerCase()
  }, function(err, user) {
    if(err) {
      req.flash('error', err);
      res.redirect('/');
    }
    else if(!user){
      req.flash('error', 'User with that username does not exist.');
      res.redirect('/');
    }
    else {
      bcrypt.compare(data.pass, user.password, function(err, passes) {
        if(passes){
          bcrypt.hash(new Date(), null, null, function(err, hash){
            res.cookie('user', user.id);
            res.cookie('authCode', hash);
            user.authCode = hash;
            user.save(function(err){
              if(err){}
              req.flash('success', 'Successfully logged in!');
              res.redirect('/courses');
            });
            
          });
          
        }
        else {
          req.flash('error', 'Wrong password.');
          res.redirect('/');
        }
      })
    }
  });
});

router.post('/logout', function(req, res){
  if(req.cookies.user && req.cookies.authCode){
    User.findById(req.cookies.user, function(err, user){
      if(req.cookies.authCode != user.authCode){
        req.flash('error', 'Stop hacking plz.');
        res.redirect('/');
      }
      else {
        res.clearCookie('user');
        res.clearCookie('authToken');
        req.flash('success', 'You\'ve successfully logged out!');
        res.redirect('/');
      }
    });
  }
  else {
    req.flash('error', 'You\'ve already logged out!');
    res.redirect('/');
  }
});
   

module.exports = router;