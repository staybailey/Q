var mongoose = require('mongoose');
var Room = require('./roomModel');

var countId = 70;

// DUMMY FUNCTION FOR TESTING. THIS SHOULD BE RANDOM
var createRoom = function () {
  return String(countId++);
}

module.exports = {
  addRoom: function(req, res, next) {
    console.log("ADDING ROOM")
    var room = createRoom();
    console.log(room);
    var newRoom = new Room({
      hash: 'hash',  
      room: room, 
      // dummy value as hash purpose unclear
      host: req.body.host,
      eventName: req.body.eventName,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      queue: [],
      guests: []

    });
    newRoom.save(function(err) {
      if (err) {
        console.log("error saving new room", err);
      } else {
        console.log('saved new room');
        res.end(room);
      }
      // res.end();
    });
  },
 

  /*

  NOT USED SEEMINGLY 

  getQueue: function(room, callback) {
    Room.findOne({identifier: room}, function(err, result) {
      callback(result.queue);
    });
  },
  
  
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
    delete data['$$hashKey'];
    Room.findOne({room: room}, function(err, result) {
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
