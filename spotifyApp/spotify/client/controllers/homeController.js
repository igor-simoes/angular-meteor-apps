angular.module('spotify').controller('homeController', function($scope, $state, $rootScope, $ionicLoading){
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
                    $scope.search = response.albums.items;

                    if ($scope.search.length>0){
                        $ionicLoading.show({
                          duration: 1000,
                          noBackdrop: true,
                          template: '<p class="item-icon-left">Search for Albums<ion-spinner icon="dots"/></p>'
                        });
                        $scope.$apply(function(){
                            $scope.search = response.albums.items;
                        });
                    }

                });
            }
            else if (type === 'artists') {
                Meteor.call('searchArtists', param, function(err, response){
                    $scope.search = response.artists.items;

                    if ($scope.search.length>0){
                        $ionicLoading.show({
                          duration: 1000,
                          noBackdrop: true,
                          template: '<p class="item-icon-left">Buscando Artistas<ion-spinner icon="dots"/></p>'
                        });
                        $scope.$apply(function(){
                            $scope.search = response.artists.items;
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
