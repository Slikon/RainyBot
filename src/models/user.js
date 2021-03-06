var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = new Schema({
  id: {
    type: String,
  },
  location: {
    type: String,
  },
  latitudeLocation: {
    type: String,
  },
  longtitudeLocation: {
    type: String,
  },
  timeToSendMessage: {
    type: String,
  },
  confirm: {
    location: String,
    latitudeLocation: String,
    longtitudeLocation: String,
  },
});

module.exports = mongoose.model('User', User);
