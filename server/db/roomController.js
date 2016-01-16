var mongoose = require('mongoose');
var Room = require('./roomModel');
var io = require('socket.io');
var utils = require('../utils.js');

// function creates a "unique" random 12 digit string of letters for the room name
var randomString = function (number) {
  var output = '';
  for (var i = 0; i < number; i++) {
    output += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Random lower case letter
  }
  return output;
}

// There could be occassional roomname overlap but it is one in 26^12
// This function adds the signature 
var createRoom = function () {
  return utils.getRoomSignature() + randomString(12);
}

module.exports = {

  
  addRoom: function(req, res, next) {
    var room = createRoom();
    var newRoom = new Room({
      hash: 'hash',  
      room: room, 
      host: req.body.host,
      eventName: req.body.eventName,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      spotify: req.body.spotify || false, // Default to soundcloud
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
      var output;
      if (err) {
        console.log("error geting playlist");
        res.statusCode('404')
        res.end();
      } else if (result) {
        output = {};
        output.votes = result.votes;
        output.spotify = result.spotify;
        output.eventName = result.eventName;
        output.startTime = result.startTime;
        output.endTime = result.endTime;
        output.host = result.host;
        res.json(output);
      }
    })
  },
  
  updateVotes: function(data, room, callback) {
    console.log("UPDATING VOTES");
    Room.findOne({ 'room' : room }, function (err, targetRoom) {
      var orderChange;
      if (err) {
        console.log('could not find the room whose votes data was to be updated');
      } else {        
        if (data.index > 0 && targetRoom.votes[data.index - 1] < data.count) { // vote count at target higher than prev song
          targetRoom.votes[data.index] = targetRoom.votes[data.index - 1];
          targetRoom.votes[data.index - 1] = data.count;
          orderChange = [data.index, data.index - 1];
        } else if (data.index < targetRoom.votes.length - 1 && targetRoom.votes[data.index + 1] > data.count) {
          targetRoom.votes[data.index] = targetRoom.votes[data.index + 1];
          targetRoom.votes[data.index + 1] = data.count;
          orderChange = [data.index, data.index + 1];          
        } else {
          targetRoom.votes[data.index] = data.count;
        }
        targetRoom.markModified('votes');
        targetRoom.save();
        console.log('the votes array..', targetRoom.votes);
        console.log('THE ORDER CHANGED?', orderChange);
        callback(targetRoom.votes, orderChange);
      }
    });
  },


  getQueue: function(room, callback) {
    Room.findOne({room: room}, function(err, result) {
      callback(result.queue);
    });
  },
  

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
      var length = result.queue.length
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
          callback(length);
        });
      });
    });
  }
};
