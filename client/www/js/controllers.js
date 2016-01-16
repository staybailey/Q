angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
'ngSanitize'
])
// THIS IS JUST A TEST
.controller('playlistController', function($scope, $rootScope, $location, Playlist, $sce, $http) {

 $rootScope.songs= [];
 $rootScope.votes= [];
 $rootScope.spotify = false;
 $rootScope.customPlaylist;

 var roomUrl = queryStringValues['room'];
 if (roomUrl) {
   $http ({
    method: 'GET',
    url: '/initPlaylist/' + roomUrl
   })
    .then(function (resp) {
      console.log(resp.data, "RESPONSE DATA");
      console.log('FB id', FB.getUserID());
      // DATA IS RETURNED CORRECTLY BUT IT 
      // POPULATES THE WRONG VALUE
      // $rootScope.songs is for search
      $rootScope.spotify = resp.data.spotify;
      $rootScope.votes = resp.data.votes;
      var userID = FB.getUserID();
      $scope.hostStatus = resp.data.host === userID;
      console.log('host?', $scope.hostStatus);
      //$rootScope.songs = resp.data.songs;
      window.socket.emit('onJoin', roomUrl);

    });
   // AND DO GET REQUEST FOR SONGS WITH ROOMURL
 } //window.socket.emit('newGuest');
  // include template for fb share button
 $scope.fbShare = $sce.trustAsHtml('<button class="btn btn-success">Share playlist with Facebook friends</button> ');
 $scope.SpotifyPlaylistMarkup = $sce.trustAsHtml('<button class="btn btn-danger spotify-login">Make Spotify Playlist</button> ');
 
 $scope.spotifyResponse = [];
 window.socket.on('voteUpdate', function(data){
  console.log('vote changed! said client', data);
  $scope.$apply(function(){
    $rootScope.votes = data;
  });
 });

  $scope.searchSong = function (isSpotify){
    // This seems gratuitous
    if ($rootScope.spotify || isSpotify) {
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
              $rootScope.votes.push(0);
            })
          }
        })

      }
    }

  }

  $scope.upVote = function(index){
    $rootScope.votes[index]++;
    var data = {index: index, count: $rootScope.votes[index]};
    console.log('upvote data is...', data);
    window.socket.emit('voteChange', data);
  }

  $scope.downVote = function(index){
    $rootScope.votes[index]--;
    var data = {index: index, count: $rootScope.votes[index]};
    console.log('downvote data is...', data);
    window.socket.emit('voteChange', data);
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
      if (Playlist.isSpotify() || $rootScope.spotify === true) {
        return true;
      } else {
        return false;
      }
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
      link: currentUrl  
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

  $scope.makeSpotifyPlaylist = function() {
    console.log('nonow');
    Playlist.makeSpotifyPlaylist
  }
  
  $scope.spotifyTrackPlayer = function(spotifyUri) {
    console.log(spotifyUri);
    $('.spotify-embed').empty();
    //$('.spotifyContainer').html('<iframe class="spotify-widget" src="https://embed.spotify.com/?uri=https://open.spotify.com/user/hlyford11/playlist/1HqZmMA5762aaCz8zhe4Ff&theme=black' + spotifyUri +'"" width="300" height="380" frameborder="0" allowtransparency="true"></iframe> ');
    $('.spotify-embed').html('<iframe src="https://embed.spotify.com/?uri='+ spotifyUri + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
    

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
      // MAY NOT WORK BUT RIGHT TRACK
      Playlist.makeHost();
      console.log(Playlist.isHost(), "I am the host");
      window.socket.emit('onJoin', res.data);
      window.location = url;

    }, function(err){
      console.log('ERR! new room was not created');
    })
  }

  /*
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
  */
})

