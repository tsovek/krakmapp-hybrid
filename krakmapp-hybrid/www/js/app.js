// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('krakmApp', ['ionic',
    'krakmApp.controllers', 'krakmApp.factories',
    'ionic-material',
    'LocalStorageModule',
    'ngCordova'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('krakmapp');
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
        })

        .state('app.mainMap', {
            url: '/mainMap',
            views: {
                'menuContent': {
                    templateUrl: 'templates/mainMap.html',
                    controller: 'MainMapCtrl'
                }
            }
        })

        .state('app.entrance', {
            url: '/entrance',
            views: {
                'menuContent': {
                    templateUrl: 'templates/entrance.html',
                    controller: 'EntranceCtrl'
                }
            }
        })

        .state('app.client', {
            url: '/client',
            views: {
                'menuContent': {
                    templateUrl: 'templates/client.html',
                    controller: 'ClientCtrl'
                }
            }
        })

        .state('app.hotel', {
            url: '/hotel',
            views: {
                'menuContent': {
                    templateUrl: 'templates/hotel.html',
                    controller: 'HotelCtrl'
                }
            }
        })

        .state('app.routes', {
            url: '/routes',
            views: {
                'menuContent': {
                    templateUrl: 'templates/routes.html',
                    controller: 'RoutesCtrl'
                }
            }
        })

        .state('app.singleRoute', {
            url: '/routes/:routeId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/singleRoute.html',
                    controller: 'SingleRouteCtrl'
                }
            }
        })

        .state('app.nativeConfig', {
            url: '/nativeConfig',
            views: {
                'menuContent': {
                    templateUrl: 'templates/nativeConfig.html'
                }
            }
        });

    $urlRouterProvider.otherwise('/app/entrance');
});
