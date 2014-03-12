'use strict';

define(['angular', 'angularRoute', 'scripts/controllers/main'], function() {

    console.log('scripts/app.js running!');
    angular.module('hnApp', ['ngRoute', 'MainCtrlProvider'])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });


    // Return
    return {

    };

});