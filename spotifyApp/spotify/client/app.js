angular.module('spotify', ['angular-meteor', 'ionic','ui.router']);

angular.module('spotify').config(function($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);
    $stateProvider
    .state('index',{
        url:'/',
        templateUrl: '/views/app.ng.html',
        controller: 'indexController'
    })
    .state('home',{
        url:'/home',
        templateUrl: '/views/home.ng.html',
        controller: 'homeController'
    })
    .state('playlists', {
        url:'/playlists',
        templateUrl: '/views/playlists.ng.html',
        controller: 'playlistsController'
    });

    $urlRouterProvider.otherwise('/');
});
