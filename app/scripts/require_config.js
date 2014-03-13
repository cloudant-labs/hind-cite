
require.config({
    baseUrl: '/',
    paths: {
        bower: 'bower_components',
        scripts: 'scripts',

        angular: '/bower_components/angular/angular',
        angularRoute: '/bower_components/angular-route/angular-route',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
        underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
        d3: 'http://cdnjs.cloudflare.com/ajax/libs/d3/3.3.11/d3.min',
        bootstrap: 'http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',

    },
    config: {
        step: {
            steps: [
                ['jquery'],
                ['bootstrap_raw']
            ]
        }
    },
    shim: {
        'd3': {
            deps: ['jquery'],
            exports: 'd3'
        },
        'underscore': {
            exports: "_"
        },
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'angularRoute': {
            deps: ['angular']
        },
        'angularAnimate': {
            deps: ['angular']
        },
        'jquery_cookie': {
            deps: ['jquery'],
            exports: '$.cookie'
        },
        'jquery_ui': {
            deps: ['jquery']
        },
        'bootstrap_raw': {
            deps: ['jquery'],
            exports: "$.fn.popover" // Example export to make sure it's loaded
        },
        enforceDefine: true
    },
    priority: [
        'angular'
    ]

});