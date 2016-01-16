var roomController = require('./db/roomController');
var userSigninController = require('./db/userSigninController');
var request = require('request');
var bodyParser = require('body-parser');
var twilio = require('./twilio.js')

module.exports = function (app, express) {
  app.post('/newUser', userSigninController.addUser);
  app.post('/newRoom', roomController.addRoom);
  // app.get('/testdb', roomController.addRoom); // remove later
  app.get('/initPlaylist/:id', roomController.initPlaylist)
  app.get('/spotifyLogin', function(req, res, next) {
    console.log(req.body);
    
  //  request('https://accounts.spotify.com/authorize?client_id=2e485d308a5e41af89967ab8965ba617&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09', function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body);
    //   }
    // }) 
  });

  app.post('/sendInvite', function (req, res) { 
    twilio.sendInvite(req.body.number, req.body.url, function (err, sent) {
      if (err) {
        return res.send({err: err});
      } else {
        res.send('Text message sent to ' + sent);
      }
    })
  });
};


//   app.get('/search', searchSC)
//   app.get('/queue', queue.getAllSongs);
//   app.post('/queue', queue.addSong, function() {
//     queue.getQueue(function(queue) {
//       socket.broadcast.emit('queue song', queue);`
      
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
