angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
'ngSanitize'
])
.controller('playlistController', function($scope, $rootScope, $location, Playlist, $sce) {
 $rootScope.songs= [];
 $rootScope.votes= [];
 $rootScope.customPlaylist;
 window.socket.emit('onJoin', queryStringValues['room']);
  // window.socket.emit('newGuest');
  // include template for fb share button
 $scope.fbShare = $sce.trustAsHtml('<div><button class="btn btn-success">Share playlist with Facebook friends</button></div> ');
 $scope.spotifyResponse = [];

$scope.searchSong = function (isSpotify){
    if (isSpotify) {
      // call the spotify api 
      if ($scope.query === '') {
        $('.spotifyResults').hide()
      } else {
        $('.spotifyResults').show()
      }
      Playlist.searchSpotifyTracks($scope.query)
        .then(function(resp) {                  
          if (resp === 'empty') {            
            $scope.spotifyResponse[0] = {};
            $scope.spotifyResponse[0].title = "please enter a search";
            $scope.spotifyResponse[0].artist = "YOU";

$scope.searchSong = function (){
    $rootScope.songs= [];
    if($scope.query === ''){
      return;
    } else{
      return Playlist.searchSongs($scope.query).then(function(tracks){
        console.log(tracks)
        for(var i = 0;i<tracks.length;i++){
          console.log(tracks[i].artwork_url)
          var track = {
                            id: tracks[i].id,
                            title: tracks[i].title,
                            artist: tracks[i].user.permalink,
                            url: tracks[i].stream_url + "?client_id=f270bdc572dc8380259d38d8015bdbe7",
                            waveform: tracks[i].waveform_url,
                        };
          if(tracks[i].artwork_url === null){
              track.image = '../img/notavailable.png';
>>>>>>> Implement vote counts data persistent logic, more work to be done
          } else {
            console.log(resp);
            var spotifyResponseSongs = resp.data.tracks.items;          
            for (var i = 0; i < spotifyResponseSongs.length; i++) {
              $scope.spotifyResponse[i] = {};
              $scope.spotifyResponse[i]['artist'] = spotifyResponseSongs[i].artists[0].name;
              $scope.spotifyResponse[i]['title'] = spotifyResponseSongs[i].name;
              $scope.spotifyResponse[i]['id'] = spotifyResponseSongs[i].id;
              $scope.spotifyResponse[i]['play_url'] = spotifyResponseSongs[i].external_urls.spotify;
              $scope.spotifyResponse[i]['popularity'] = spotifyResponseSongs[i].popularity;
              $scope.spotifyResponse[i]['duration'] = spotifyResponseSongs[i].duration_ms;
              $scope.spotifyResponse[i]['uri'] = spotifyResponseSongs[i].uri;

            }                 
          }
        })      

      // show the results in the dropdown list dealie

      // selection adds to the playlist

    } else {
      // else do soundclound search
      $rootScope.songs= [];
      if($scope.query === ''){
        return;
      } else{
        return Playlist.searchSongs($scope.query).then(function(tracks){
          console.log(tracks)
          for(var i = 0;i<tracks.length;i++){
            console.log(tracks[i].artwork_url)
            var track = {
                              id: tracks[i].id,
                              title: tracks[i].title,
                              artist: tracks[i].user.permalink,
                              url: tracks[i].stream_url + "?client_id=f270bdc572dc8380259d38d8015bdbe7",
                              waveform: tracks[i].waveform_url
                          };
            if(tracks[i].artwork_url === null){
                track.image = '../img/notavailable.png';
            } else {
                track.image = tracks[i].artwork_url
            }
            $rootScope.$apply(function(){
              $rootScope.songs.push(track);
            })
          }
<<<<<<< fac7a88c2a621bffaed77599e57b4776bd4c0bb8
        })
=======
          $rootScope.$apply(function(){
            $rootScope.songs.push(track);
            $rootScope.votes.push(0);
          })
        }
      })
>>>>>>> Implement vote counts data persistent logic, more work to be done

      }
    }

  }

  $scope.upVote = function(index){
    $rootScope.votes[index]++;
    window.socket.emit('upVote');
  }

  $scope.downVote = function(index){
    $rootScope.votes[index]--;
    window.socket.emit('downVote');
  }

  $scope.clearResults = function (){
    $scope.query = '';
    $rootScope.songs = [];
  }
  $scope.clearSpotify = function() {    
    $scope.query = '';
    $('.spotifyResults').hide();
  }

  $scope.isHost = function(){
      return Playlist.isHost();
  }
  // show the spotify stuff is that was selected
  $scope.isSpotify = function(){      
      return Playlist.isSpotify();
  }

  $scope.clearResults = function (){
    $scope.query = '';
    $rootScope.songs = [];
  }

  $scope.fbShareSend = function() {
    var currentUrl = window.location.href;
    FB.ui({
      method: 'send',
      // once the app is live we can set it to go to window.location.href
      link: 'http://google.com'    
    });  
  }
  $scope.spotifyExpand = function(status) {
    console.log('here this', $('this'));    
    // console.log('here actual', $('spotify-embed'));  
    if (status === 'enter') {    
      $('.spotify-embed-main').addClass('spotify-embed-active', 2000).removeClass('spotify-embed', 2000);
    } else {
      $('.spotify-embed-main').addClass('spotify-embed', 500).removeClass('spotify-embed-active');
    }
  }
  // console.log(Playlist.isHost());
})

.controller('landingPageController', function($scope, $http, $location, $state, Playlist){
  $scope.roomData = {};


  $scope.createRoom = function(){
    // check if it's a spotify room    
    Playlist.isSpotifyFirst($scope.roomData.spotify);

    $scope.roomData.host = FB.getUserID();
    var data = $scope.roomData;
    console.log('sending POST request with data...', $scope.roomData);
    $http({
      method: 'POST',
      url: '/newRoom',
      data: data
    })
    .then(function(res){
      console.log('new room created successfully!');
      var url = '#/playlist?room=' + res.data;
      console.log('redirecting to the newly created room', url);
      window.location = url;
    }, function(err){
      console.log('ERR! new room was not created');
    });
  }

  $scope.makeHost = function(){

    // Note: this is a temporary fix for the demo, and should not be used as actual authentication
    if($scope.createRoomPassword === "test"){
      Playlist.makeHost();
      $state.go('playlist');
    }
  }

  $scope.makeGuest = function(){
    Playlist.makeGuest();
    $state.go('playlist');
  }

  $scope.attemptHost = false;
  $scope.createRoomPassword;
})
