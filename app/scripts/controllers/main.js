'use strict';

define(['angular'], function () {

    // Init code
    var mainCtrlProvider=angular.module('MainCtrlProvider', []);


    mainCtrlProvider
        .controller('MainCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });

    // Return
    return {

    }

});
