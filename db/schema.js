var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  username: String,
  password: String,
  email: String
});

mongoose.model('User', User);

var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('YEAH');
// })

mongoose.connect('mongodb://localhost/test');