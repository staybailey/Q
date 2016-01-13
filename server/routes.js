var roomController = require('./db/roomController');
var userSigninController = require('./db/userSigninController');

module.exports = function (app, express) {
  app.post('/newUser', userSigninController.addUser);
  app.get('/testdb', roomController.addRoom);
};


//   app.get('/search', searchSC)
//   app.get('/queue', queue.getAllSongs);
//   app.post('/queue', queue.addSong, function() {
//     queue.getQueue(function(queue) {
//       socket.broadcast.emit('queue song', queue);
      
//     })
//   });

//   socket.on('pageLoad')

//   socket.on('addSong')


//   })

//   socket.emit('event', {userID : window.params, songId: songID})
//   // app.post('/restaurants', yelpSearch);
//   // app.get('/restaurants/left', db.chooseLeft);
//   // app.get('/restaurants/right', db.chooseRight);
// };
