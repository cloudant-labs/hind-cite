'use strict';
/*global $:false, angular:false */


angular.module('mainApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'statesServiceProvider'
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                caseInsensitiveMatch: true,
                reloadOnSearch: false
            })
            .when('/snapsPerDay', {
                templateUrl: 'views/snapsPerDay.html',
                caseInsensitiveMatch: true,
                reloadOnSearch: false
            })
            .when('/post', {
                templateUrl: 'views/post.html',
                caseInsensitiveMatch: true,
                reloadOnSearch: false
            })
            .when('/test', {
                templateUrl: 'views/test.html',
                caseInsensitiveMatch: true,
                reloadOnSearch: false
            })
            .when('/multipost', {
                templateUrl: 'views/multiPost.html',
                caseInsensitiveMatch: true,
                reloadOnSearch: false
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

// Also do non-angular project initialization
$(document).ready(function() {

    $('* [rel="tooltip"]').tooltip({
        html: true,
        trigger: 'click hover focus manual',
        delay: {show: 0, hide:200},
        placement: 'top'
    });

});