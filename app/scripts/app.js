'use strict';

define(['angular', 'angularRoute', 'scripts/controllers/main'], function() {

    console.log('scripts/app.js running!');
    angular.module('hnApp', ['ngRoute', 'MainCtrlProvider'])
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/test', {
                    templateUrl: 'views/test.html',
                    controller: 'MainCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);


    // Return
    return {

    };

});