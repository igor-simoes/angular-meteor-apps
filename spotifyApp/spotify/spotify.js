if (Meteor.isClient) {
    var app = angular.module('spotify', ['angular-meteor', 'ionic','ui.router']);

    app.config(function($stateProvider, $locationProvider, $urlRouterProvider){
        $locationProvider.html5Mode(true);
        $stateProvider
        .state('index',{
            url:'/',
            templateUrl: 'app.ng.html',
            controller: 'indexController'
        })
        .state('home',{
            url:'/home',
            templateUrl: 'home.ng.html',
            controller: 'homeController'
        })
        .state('playlists', {
            url:'/playlists',
            templateUrl: 'playlists.ng.html',
            controller: 'playlistsController'
        });

        $urlRouterProvider.otherwise('/');
    });

    // CONTROLLERS

    app.controller('playlistsController', function($scope, $rootScope, $ionicLoading){
        $scope.playlists = [];

        $scope.getPlaylists = function(){
            Meteor.call('getPlaylists', $rootScope.currentUser.profile.id, function(err, response){
                $scope.playlists = response.items;

                if ($scope.playlists.length>0){
                    $ionicLoading.show({
                      duration: 1000,
                      noBackdrop: true,
                      template: '<p class="item-icon-left">Buscando suas playlists<ion-spinner icon="dots"/></p>'
                    });
                    $scope.$apply(function(){
                        $scope.playlists = response.items;
                    });
                }
            });
        }();
    });

    app.controller('indexController', function($scope, $state){
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

    app.controller('homeController', function($scope, $state, $rootScope, $ionicLoading){
        $scope.view = $state.current.name;
        $scope.user = $rootScope.currentUser.profile.display_name;
        $scope.searches = [
            {type: 'artists'},
            {type: 'albums'},
            {type: 'all'}
        ];

        $scope.onHome = function(){
            $state.go('home');
        }

        $scope.onVolume = function(){
            console.log('not implemented yet!');
        };

        $scope.viewPlaylists = function() {
            $state.go('playlists');
        };

        $scope.onSearch = function(type, param){
            if (type === 'albums'){
                Meteor.call('searchAlbums', param, function(err, response){
                    $scope.pesquisa = response.albums.items;

                    if ($scope.pesquisa.length>0){
                        $ionicLoading.show({
                          duration: 1000,
                          noBackdrop: true,
                          template: '<p class="item-icon-left">Buscando Albuns<ion-spinner icon="dots"/></p>'
                        });
                        $scope.$apply(function(){
                            $scope.pesquisa = response.albums.items;
                        });
                    }

                });
            }
            else if (type === 'artists') {
                Meteor.call('searchArtists', param, function(err, response){
                    $scope.pesquisa = response.artists.items;

                    if ($scope.pesquisa.length>0){
                        $ionicLoading.show({
                          duration: 1000,
                          noBackdrop: true,
                          template: '<p class="item-icon-left">Buscando Artistas<ion-spinner icon="dots"/></p>'
                        });
                        $scope.$apply(function(){
                            $scope.pesquisa = response.artists.items;
                        });
                    }
                });
            }
            else {
                console.log('not implemented yet!');
            }
        };

        $scope.onExit = function(){
            Meteor.logout();
            $state.go('index');
        }
    });
}

if (Meteor.isServer) {


  Meteor.startup(function () {
      ServiceConfiguration.configurations.update(
          { "service": "spotify" },
          {
            $set: {
              "clientId": Meteor.settings.private.clientId,
              "secret": Meteor.settings.private.secret
            }
          },
          { upsert: true }
      );
  });

  Meteor.methods({

    searchAlbums: function(query) {
        var spotifyApi = new SpotifyWebApi();
        //grab JSON list of albums based on text search
        var response = spotifyApi.searchAlbums(query, {
          limit: 50
        });
        // Need to refresh token
        if (checkTokenRefreshed(response, spotifyApi)) {
          response = spotifyApi.searchAlbums(query, {
            limit: 50
          });
        }
        return response.data.body;
    },

    searchArtists: function(query){
        var spotifyApi = new SpotifyWebApi();
        //grab JSON list of albums based on text search
        var response = spotifyApi.searchArtists(query, {
          limit: 50
        });
        // Need to refresh token
        if (checkTokenRefreshed(response, spotifyApi)) {
          response = spotifyApi.searchArtist(query, {
            limit: 50
          });
        }
        return response.data.body;
    },

    getPlaylists: function(query){
        var spotifyApi = new SpotifyWebApi();
        //grab JSON list of albums based on text search
        var response = spotifyApi.getUserPlaylists(query, {
          limit: 50
        });
        // Need to refresh token
        if (checkTokenRefreshed(response, spotifyApi)) {
          response = spotifyApi.getUserPlaylists(query, {
            limit: 50
          });
        }
        return response.data.body;
    }

});
    var checkTokenRefreshed = function(response, api) {
      if (response.error && response.error.statusCode === 401) {
        api.refreshAndUpdateAccessToken();
        return true;
      }

      return false;
    };
}
