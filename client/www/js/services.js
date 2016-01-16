angular.module('Q.services', [
'ionic'
])


.factory('Playlist', function($http){
    
  // NOT CLEAR WHAT THIS DOES BUT USED BY IO
  var getSongs = function(){
      return $http ({
        method: 'GET',
        url: '/'
      }).then(function(response){
        return response.data;
      })
  };

  var addSong = function (song){
    return $http ({
      method: 'GET',
      url: '/',
      data: song
    })
  }

  var searchSongs = function(query){
    SC.initialize({
      client_id: 'f270bdc572dc8380259d38d8015bdbe7'
    });

    return SC.get('/tracks', {
      q: query,
    }).then(function(tracks) {
      return tracks;
    });
  }
  var searchSpotifyTracks = function (query) {      
    if (query === '') {       
      return 'empty'
    }
    return $http ({
      method: 'GET',
      url: 'https://api.spotify.com/v1/search?type=track&limit=10&market=US&q=' + query      
    })
  }
  // make a spotify palylist for the room
  var makeSpotifyPlaylist = function () {      
  // first get the token for that user
  
    return $http({
      method: 'GET',
      url: 'https://accounts.spotify.com/authorize/?client_id=2e485d308a5e41af89967ab8965ba617&response_type=code&redirect_uri=http://localhost:8000/spotifyLogin&scope=user-read-private%20user-read-email&state=34fFs29kd09'
    })
    // return $http ({
    //   method: 'POST',
    //   url: 'https://api.spotify.com/v1/search?type=track&limit=10&market=US&q=' + query      
    // })
  }

  // isHostData in factory stores whether or not
  // the current user is the host
  
  var isHostData = false;
  var isSpotifyLanding;

  var isHost = function(){
    return isHostData;
  }
  var isSpotify = function(){
    // change to be dynamic when we take this input      
    return isSpotifyLanding;   
  }
  var isSpotifyFirst = function(input){
    // change to checkbox later
    console.log('input in isSpotifyFirst', input);     
    if (input === 'true') {
      isSpotifyLanding = true
    } else {
      isSpotifyLanding = false
    }    
  }

  var makeHost = function () {
    isHostData = true;
  }

  var makeGuest = function(){
    isHostData = false;
  }

  return {
    getSongs: getSongs,
    addSong: addSong,
    searchSongs: searchSongs,
    makeHost: makeHost,
    makeGuest: makeGuest,
    isHost: isHost,
    isSpotify: isSpotify,
    isSpotifyFirst: isSpotifyFirst,
    searchSpotifyTracks: searchSpotifyTracks,
    makeSpotifyPlaylist: makeSpotifyPlaylist
  }
})
/*
.factory('socket', function ($rootScope) {
  // var socket = io.connect();
  var socket = window.socket
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
*/
