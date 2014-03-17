'use strict';

angular.module('hnApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'controllersProvider',
        'directivesProvider',
        'servicesProvider'
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl'
            })
            .when('/snapsPerDay', {
                templateUrl: 'views/snapsPerDay.html',
            })
            .when('/post', {
                templateUrl: 'views/post.html',
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
