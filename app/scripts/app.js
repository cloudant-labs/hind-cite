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
                caseInsensitiveMatch: true
            })
            .when('/snapsPerDay', {
                templateUrl: 'views/snapsPerDay.html',
                caseInsensitiveMatch: true
            })
            .when('/post', {
                templateUrl: 'views/post.html',
                caseInsensitiveMatch: true
            })
            .when('/test', {
                templateUrl: 'views/test.html',
                caseInsensitiveMatch: true
            })
            .when('/multipost', {
                templateUrl: 'views/multiPost.html',
                caseInsensitiveMatch: true
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