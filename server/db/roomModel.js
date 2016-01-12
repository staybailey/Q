var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    queue: [],
    hash: String,
    guests: [],
    host: String,
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
