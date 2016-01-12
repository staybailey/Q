var mongoose = require('mongoose');
var Room = require('./roomModel');

module.exports = {
  addRoom: function(req, res, next) {
    var newRoom = new Room({
      // host: req.body.host;
      // roomname: req.body.roomname;
      queue: []
    });
    newRoom.save(function(err) {
      if (err) console.log("error saving new room", err);
      else {
        console.log('saved new room');
      }
      // res.end();
    });
  },

  getQueue: function(callback) {
    Room.findOne({}, function(err, result) {
      callback(result.queue);
    });
  },

  saveQueue: function(updatedQueue, callback) {
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

  addSong: function(data, callback) {
    delete data['$$hashKey'];
    Room.findOne({}, function(err, result) {
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

  deleteSong: function(target, callback) {
    Room.findOne({}, function(err, result) {

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
