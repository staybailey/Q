var mongoose = require('mongoose');
var Room = require('./roomModel');
var io = require('socket.io');

var randomString = function (number) {
  var output = '';
  for (var i = 0; i < number; i++) {
    output += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return output;
}

// There could be occassional roomname overlap but it one in 26^12
var createRoom = function () {
  return 'jhbb' + randomString(12);
}

module.exports = {
  addRoom: function(req, res, next) {
    console.log("ADDING ROOM");
    var room = createRoom();
    console.log(room);
    var newRoom = new Room({
      hash: 'hash',  
      room: room, 
      host: req.body.host,
      eventName: req.body.eventName,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      spotify: req.body.spotify || true, // Default to spotify
      queue: [],
      votes: []
    });
    newRoom.save(function(err) {
      if (err) {
        console.log("error saving new room", err);
      } else {
        console.log('saved new room');
        res.end(room);
      }
    });
  },
 
  initPlaylist: function(req, res, next) {
    console.log("Initializing Playlist");
    Room.findOne({room: req.params.id}, function (err, result) {
      var output;;
      if (err) {
        console.log("error geting playlist");
        res.statusCode('404')
        res.end();
      } else if (result) {
        output = {};
        output.queue = result.queue;
        output.votes = result.votes;
        output.spotify = result.spotify;
        res.json(output);
      }
    }),
  
  updateVotes: function(data, room) {
    console.log("UPDATING VOTES");
    Room.findOne({ 'room' : room }, function (err, targetRoom) {
      if (err) {
        console.log('could not find the room whose votes data was to be updated');
      } else {
        targetRoom.votes[data.index] = data.count;
        targetRoom.markModified('votes');
        targetRoom.save();
      }
    });
  },


  getQueue: function(room, callback) {
    Room.findOne({room: room}, function(err, result) {
      callback(result.queue);
    });
  },
  
  /*
  saveQueue: function(updatedQueue, room, callback) {
    updatedQueue = updatedQueue.map(function(song) {
      delete song['$$hashKey'];
      return song;
    });
    Room.findOne({}, function(err, result) {
      console.log(updatedQueue)
      result.queue = updatedQueue;
      result.save(function(err) {
        console.error(err);
        callback();
      });
    });
  },
  */

  addSong: function(data, room, callback) {
    console.log("ADDING A SONG TO ROOM", room);
    delete data['$$hashKey'];
    Room.findOne({room: room}, function(err, result) {
      console.log("FOUND ROOM ENTRY", result);
      var alreadyAdded = false;
      result.queue.forEach(function(song) {
        if (data.id === song.id) {
          alreadyAdded = true;
        }
      });
      if (!alreadyAdded) {
        result.queue.push(data);
        result.save(function(err) {
          console.error(err);
          callback();
        });
      } else {
        return;
      }
    });
  },

  deleteSong: function(target, room, callback) {
    Room.findOne({room: room}, function(err, result) {
      console.log(target);
      var deleteLocations = [];
      result.queue.forEach(function(song, index) {
        console.log('deleting', song)
        if (song.id === target) {
          deleteLocations.push(index);
        }
      });
      deleteLocations.forEach(function(deleteLocation) {
        result.queue.splice(deleteLocation, 1);
        result.save(function(err) {
          console.error(err);
          callback();
        });
      });
    });
  }
};
