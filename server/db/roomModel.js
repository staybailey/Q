var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
  indentifier: {type: String, unique: true},
  hash: String,
  host: String,
  eventName: String,
  startTime: Date,
  endTime: Date,
  queue: [],
  guests: []

});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
