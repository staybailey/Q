var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
  hash: String,
  room: String,
  host: String,
  eventName: String,
  startTime: Date,
  endTime: Date,
  spotify: Boolean,
  queue: [],
  votes: [],
  guests: []

});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
