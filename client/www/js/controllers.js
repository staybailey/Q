angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
'ngSanitize'
])

.controller('playlistController', function($scope, $rootScope, $location, Playlist, $sce) {
 $rootScope.songs= [];
 $rootScope.customPlaylist;
 window.socket.emit('onJoin', queryStringValues['room']);
  //window.socket.emit('newGuest');
  // include template for fb share button
 $scope.fbShare = $sce.trustAsHtml('<div><button class="btn btn-success">Share playlist with Facebook friends</button></div> ');
 

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
                            waveform: tracks[i].waveform_url
                        };
          if(tracks[i].artwork_url === null){
              track.image = '../img/notavailable.png';
          } else {
              track.image = tracks[i].artwork_url
          }
          $rootScope.$apply(function(){
            console.log("THIS GOT CALLED")
            $rootScope.songs.push(track);
          })
        }
      })

    }

  }

  $scope.clearResults = function (){
    $scope.query = '';
    $rootScope.songs = [];
  }

  $scope.isHost = function(){
      return Playlist.isHost();
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
  console.log(Playlist.isHost());
})

.controller('landingPageController', function($scope, $http, $location, $state, Playlist){
  $scope.roomData = {};

  $scope.createRoom = function(){
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
      window.location = url;
    }, function(err){
      console.log('ERR! new room was not created');
    })
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
