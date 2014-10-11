var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Course = mongoose.model('Course');

var validateLogin = function(req, res){
  if(!req.cookies.authCode){
    req.flash('error', 'You need to be logged in to access this page.')
    res.redirect('/');
  }
}

router.get('/courses', function(req, res){
  validateLogin(req, res);
  Course.find({}, function(err, courses) {
    res.render('courses/index', {
      error: req.flash('error'), 
      success: req.flash('success'),
      courses: courses
    });
  });
  
});

router.get('/courses/new', function(req, res){
  validateLogin(req, res);
  res.render('courses/new', {
    error: req.flash('error'), 
    success: req.flash('success') 
  });
});

router.post('/courses/new', function(req, res){
  validateLogin(req, res);

  var data = req.body;

  if(!data.code.length || !data.name.length) {
    req.flash('error', 'Both fields are required.');
    res.redirect('/courses/new');
  }
  else {
    Course.findOne({
      code: data.code
    }, function(err, course){
      if(course){
        req.flash('error', 'Course already exists, yo.');
        res.redirect('/courses/new');
      }
      else{
        new Course({
          code: data.code,
          name: data.name,
          prereqs: []
        }).save(function(err, obj){
          if(err){}
          else{
            req.flash('success', 'Successfully created course!');
            res.redirect('/courses');
            return;
          }
        });
      }
    })
  }
  
});

router.get('/courses/:id', function(req, res){
  console.log(req.params.id);
  Course.findById(req.params.id, function(err, course){
    res.redirect('/courses/show', { course: course });
  });
});

module.exports = router;