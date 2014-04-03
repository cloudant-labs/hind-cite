'use strict';
/*global angular:false, getData:false */



/**
 * Simple service wrapper on getData
 */
angular.module('mainApp').factory('getDataSvc', function() {

    return getData;
});

