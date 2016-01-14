angular.module('Q.services', [
'ionic'
])


.factory('Playlist', function($http){
  var getSongs = function(){
      return $http ({
        method: 'GET',
        url: '/'
      }).then(function(response){
        return response.data;
      })
  }

  var addSong = function (song){
    return $http ({
      method: 'POST',
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
    console.log('on other', query);  
    if (query === '') { 
      console.log('hihiihi');     
      return 'empty'
    }
    return $http ({
      method: 'GET',
      url: 'https://api.spotify.com/v1/search?type=track&limit=10&market=US&q=' + query      
    })
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
    if (input === 'y') {
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
    searchSpotifyTracks: searchSpotifyTracks
  }
})