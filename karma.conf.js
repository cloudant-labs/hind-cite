// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: 'app',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/json3/lib/json3.min.js',

            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/underscore/underscore.js',

            'bower_components/angular/angular.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/d3/d3.js',
            'bower_components/hogan/web/builds/2.0.0/hogan-2.0.0.min.js',
            'scripts/safelog.js',
            'scripts/config.js',
            'scripts/log.js',
            'scripts/utilities.js',
            'scripts/hnutils.js',
            'scripts/getData.js',

            'scripts/ang/statesSvcProvider.js',

            'scripts/ang/app.js',
            'scripts/ang/services.js',
            'scripts/ang/controllers.js',
            'scripts/ang/directives.js',
            'scripts/ang/filters.js',

            'scripts/vend_mod/nvd3/nv.d3.js',

            'scripts/charts/snapsPerDay.js',
            'scripts/charts/multiPost.js',

            'scripts/vend_mod/algolia/jquery.timeago.js',
            'scripts/vend_mod/algolia/bootstrap-typeahead.js',
            'scripts/vend_mod/algolia/bootstrap-tagautocomplete.js',
            'scripts/vend_mod/algolia/algoliaSearch.js',
            'scripts/vend_mod/algolia/hnsearch.js',


            '../test/mock/**/*.js',
            '../test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
