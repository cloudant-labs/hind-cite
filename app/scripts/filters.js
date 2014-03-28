'use strict';

var filtersProvider = angular.module('filtersProvider', []);

filtersProvider
    .filter('titleCase', function () {
        return function (input) {
            return input.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    });