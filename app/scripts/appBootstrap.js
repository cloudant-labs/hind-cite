'use strict';

// Bootstrap the app

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";
console.log('appBootstrap: Before require');

require(["/scripts/require_config.js"], function () {
    require(['angular', 'scripts/app', 'jquery', 'bootstrap'], function (angular, app) {

        console.log('appBootstrap: before bootstap');
        angular.bootstrap(document, ['hnApp'])

        /* jshint ignore:start */
         console.log('appBootstrap: before resume bootstap');
        var $html = angular.element(document.getElementsByTagName('html')[0]);
        /* jshint ignore:end */
        angular.element().ready(function () {
            angular.resumeBootstrap(['hnApp']);
             console.log('appBootstrap: after resume bootstap');
        });
    })
});