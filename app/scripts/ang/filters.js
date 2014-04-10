/*global angular:false */


angular.module('mainApp')
    .filter('titleCase', function () {
        'use strict';
        return function (input) {
            return input.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
    })
    .filter('numLocale', function () {
        'use strict';
        return function (input) {
            return input.toLocaleString();
        };
    });
