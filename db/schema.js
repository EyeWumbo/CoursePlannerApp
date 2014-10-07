var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  username: String,
  password: String,
  email: String,
  courses: [Course],
  authCode: String
});

User.methods.verifyPass = function(pass) {
  return this.password == pass;
}

var Course = new Schema({
  code: String,
  name: String,
  prereqs: [Course]
});

mongoose.model('User', User);
mongoose.model('Course', Course);

var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('YEAH');
// })

mongoose.connect('mongodb://localhost/test');