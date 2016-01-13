var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var SC = require('node-soundcloud');
var db = require('./db/dbConfig');
var Room = require('./db/roomController');
var roomModel = require('./db/roomModel');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/www'));

require('./routes.js')(app, express);
var port = process.env.PORT || 8000;
server.listen(port);

// This empties the database and seeds the database with one room with an empty queue (no multi-room functionality yet)
roomModel.remove({}, function() {
  new roomModel({
    //to check with Harun and Spener
    queue: []
  }).save(function(err) {
    if (err) console.error("error seeding database", err);
    else {
      console.log('saved new user');
    }
  });
});


// io.configure(function () {  
// });


io.on('connection', function (socket) {
  console.log('New user came in with ID of: ' + socket.id);
  console.log('New user started in rooms: ' + socket.rooms);
  console.log(io.sockets.adapter.rooms);
  // This line needed only for Heroku, comment it out if serving locally
  // io.set("transports", ["polling"]); 

  // Room.getQueue(function(queue) {
  //   socket.emit('getQueue', queue);
  // });

  socket.on('onJoin', function (req, res, next) {
    socket.join(req.params.id);
    console.log(io.sockets.adapter.rooms[req.params.id]);
  });

  socket.on('newGuest', function() {
    Room.getQueue(function(queue) {
      socket.emit('getQueue', queue);
    });
  });

  socket.on('addSong', function (newSong) {
    Room.addSong(newSong, function() {
      socket.emit('newSong', newSong);
      socket.broadcast.emit('newSong', newSong);
      // Room.getQueue(function(queue) {
      // });
    });
  });

  socket.on('deleteSong', function (target) {
    Room.deleteSong(target.song, function() {
      socket.emit('deleteSong', target);
      socket.broadcast.emit('deleteSong', target);
    });
  });

  socket.on('progress', function (data) {
    console.log(data);
  });

  socket.on('currentlyPlaying', function (data) {
    socket.emit('currentlyPlaying', data);
    socket.broadcast.emit('currentlyPlaying', data);
  });

  socket.on('currentTrackPosition', function (data) {
    socket.emit('currentTrackPosition', data);
    socket.broadcast.emit('currentTrackPosition', data);
  });

  socket.on('currentTrackDuration', function (data) {
    socket.emit('currentTrackDuration', data);
    socket.broadcast.emit('currentTrackDuration', data);
  });

  socket.on('isPlaying', function (data) {
    socket.emit('isPlaying', data);
    socket.broadcast.emit('isPlaying', data);
  });
});
