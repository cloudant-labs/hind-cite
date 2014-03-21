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
            })
            .when('/snapsPerDay', {
                templateUrl: 'views/snapsPerDay.html',
            })
            .when('/post', {
                templateUrl: 'views/post.html',
            })
            .when('/test', {
                templateUrl: 'views/test.html',
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

// Also do non-angular project initialization
$(document).ready(function() {

    $("* [rel='tooltip']").tooltip({
        html: true,
        trigger: 'click hover focus manual',
        delay: {show: 0, hide:200},
        placement: 'top'
    });

});