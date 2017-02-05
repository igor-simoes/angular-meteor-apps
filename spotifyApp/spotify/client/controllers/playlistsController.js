angular.module('spotify').controller('playlistsController', function($scope, $rootScope, $ionicLoading){
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
