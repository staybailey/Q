var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var SC = require('node-soundcloud');
var db = require('./db/dbConfig');
var Room = require('./db/roomController');
var roomModel = require('./db/roomModel');
var twilio = require('./twilio');
var session = require('express-session');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/www'));
app.use(session({
  secret: twilio.config.secret,
  resave: true,
  saveUninitialized: true
}));
app.use(twilio.sendInvite);

require('./routes.js')(app, express);

var port = process.env.PORT || 8000;
server.listen(port);
console.log('Server listening to port: ' + port);

// This empties the database and seeds the database with one room with an empty queue (no multi-room functionality yet)
/*
roomModel.remove({}, function() {
  new roomModel({
    //to check with Harun and Spener
    queue: []
  }).save(function(err) {
    if (err) console.error("error seeding database", err);
    else {
      console.log('Created new room');
    }
  });
});
*/

// io.configure(function () {  
// });


io.on('connection', function (socket) {
  // console.log('New user logged on with ID of: ' + socket.id);
  // This line needed only for Heroku, comment it out if serving locally
  // io.set("transports", ["polling"]); 

  // Room.getQueue(function(queue) {
  //   socket.emit('getQueue', queue);
  // });

  socket.on('onJoin', function (room) {
    socket.join(room);
    console.log("THE SOCKET ROOMS ARRAY IS\n", socket.rooms);
    /*
    Room.getQueue(room, function (queue) {
      console.log(queue);
      socket.to(room).emit('getQueue', queue);
    });
    */
  });

  socket.on('addSong', function (newSong) {
    console.log("SOCKET ROOMS ON ADD SONG:", socket.rooms);
    var room;
    for (var key in socket.rooms) {
      // The typeof is just an error check and should be gratuitous now
      if (typeof socket.rooms[key] === 'string' && socket.rooms[key].substr(0, 4) === 'jhbb') { // THIS MUST MATCH room generator
        room = socket.rooms[key];
      }
    }
    console.log("ADDING SONG TO THE ROOM:", room);
    if (room) {
      Room.addSong(newSong, room, function() {
        socket.emit('newSong', newSong);
        socket.to(room).broadcast.emit('newSong', newSong);
      });
    }
  });

  socket.on('deleteSong', function (target) {
    var room;
    for (var key in socket.rooms) {
      if (socket.rooms[key].substr(0, 4) === 'jhbb') { // THIS MUST MATCH room generator
        room = socket.rooms[key];
      }
    }
    if (room) {
      Room.deleteSong(target.song, room, function() {
        socket.emit('deleteSong', target);
        socket.to(room).broadcast.emit('deleteSong', target);
      });
    }
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

  socket.on('voteChange', function (data) {
    console.log('voteChange heard in server');
    var room;

    for (var key in socket.rooms) {
      // The typeof is just an error check and should be gratuitous now
      if (typeof socket.rooms[key] === 'string' && socket.rooms[key].substr(0, 4) === 'jhbb') { // THIS MUST MATCH room generator
        room = socket.rooms[key];
      }
    }

    console.log('room is...', room);
    console.log('data is...', data);
    Room.updateVotes(data, room);

  });
  
});













