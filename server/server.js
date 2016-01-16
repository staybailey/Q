var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var SC = require('node-soundcloud');
var db = require('./db/dbConfig');
var Room = require('./db/roomController');
var roomModel = require('./db/roomModel');
var utils = require('./utils.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/www'));

require('./routes.js')(app, express);

var port = process.env.PORT || 8000;
server.listen(port);
console.log('Server listening to port: ' + port);

io.on('connection', function (socket) {
  // This line needed only for Heroku, comment it out if serving locally
  // io.set("transports", ["polling"]); 
  
  socket.on('onJoin', function (room) {
    socket.join(room);
    Room.getQueue(room, function (queue) {
      io.to(room).emit('getQueue', queue);
    });    
  });


  socket.on('addSong', function (newSong) {
    var room = utils.getSocketRoom(socket.rooms);
    console.log("adding song", newSong, "into room", room);
    if (room) {
      Room.addSong(newSong, room, function() {
        // socket.emit('newSong', newSong);
        socket.to(room).broadcast.emit('newSong', newSong);
      });
    }
  });

  socket.on('deleteSong', function (target) {
    var room = utils.getSocketRoom(socket.rooms);
    if (room) {
      Room.deleteSong(target.song, room, function(length) {
        // socket.emit('deleteSong', target);
        io.to(room).emit('songDeleted', target, length);
      });
    }
  });

  socket.on('voteChange', function (data) {
    var room = utils.getSocketRoom(socket.rooms);
    if (room) {
      Room.updateVotes(data, room, function(voteCounts, orderChange){
        // socket.emit('voteUpdate', voteCounts)
        if (orderChange) {
          io.to(room).emit('voteOrderUpdate', orderChange);
        }
        socket.to(room).broadcast.emit('voteUpdate', voteCounts);
      });
    }
  });

  socket.on('progress', function (data) {
    console.log(data);
  });

  socket.on('currentlyPlaying', function (data) {
    //socket.emit('currentlyPlaying', data);
    socket.broadcast.emit('currentlyPlaying', data);
  });

  socket.on('currentTrackPosition', function (data) {
    //socket.emit('currentTrackPosition', data);
    socket.broadcast.emit('currentTrackPosition', data);
  });

  socket.on('currentTrackDuration', function (data) {
    //socket.emit('currentTrackDuration', data);
    socket.broadcast.emit('currentTrackDuration', data);
  });

  socket.on('isPlaying', function (data) {
    //socket.emit('isPlaying', data);
    socket.broadcast.emit('isPlaying', data);
  });
});













