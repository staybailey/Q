var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
  hash: String,
  room: {type: String, unique: true},
  host: String,
  eventName: String,
  startTime: Date,
  endTime: Date,
  queue: [],
  guests: []

});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
