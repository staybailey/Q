var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
  queue: [],
  hash: String,
  guests: [],
  host: String,
  eventName: String,
  startTime: Date,
  endTime: Date
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
