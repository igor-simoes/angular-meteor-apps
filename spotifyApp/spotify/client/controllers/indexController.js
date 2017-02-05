angular.module('spotify').controller('indexController', function($scope, $state){
    $scope.view = $state.current.name;

    $scope.onLogin = function(){
        var options = {
          showDialog: true, // Whether or not to force the user to approve the app again if they’ve already done so.
          requestPermissions: [
              'user-read-email',
              'user-read-private',
              'playlist-read-private',
              'playlist-modify-private'
          ] // Spotify access scopes.
        };
        Meteor.loginWithSpotify(options, function(err) {
          if (err){
              // not implemented yet!
              console.log("Login invalid");
          }
          else{
              $state.go('home');
          }
        });

    };
});
