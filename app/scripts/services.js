'use strict';

// requires getData

var svcProvider = angular.module('servicesProvider', []);

/**
 * Simple service wrapper on getData
 */
svcProvider.factory('getDataSvc', function() {

    return getData;
});

