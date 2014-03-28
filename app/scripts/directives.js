'use strict';

// requires

var directivesProvider=angular.module('directivesProvider', ['servicesProvider']);

directivesProvider.directive('spdChart', ['getDataSvc',
    function factory(getDataSvc) {
        var directiveDefinitionObject = {
            template:
                '<div class="chart_container">'
                    +    ' <div class="chart"></div>'
                    + '</div>',
            scope: {
                data : '=',
                datatimestamp : '='
            },
            restrict: 'E',
            transclude: 'false',
            replace: true,
            link: {
                post: function(scope, element, attrs) { // post-link function

                    scope.id=element.attr('id');

                    scope.chart=chartSnapsPerDay.chart();
                    console.log(scope.id, scope.chartsize);
                    scope.chart.init({elId: scope.id, chartSize : scope.chartsize, data: []});


                    console.log('histChart directive - post link function. Scope: ', scope, 'attrs', attrs);

                    scope.$watch('datatimestamp', function(newVal, oldVal){
                        console.log('spd-Chart: scope.datatimestamp watch signalled', newVal, scope.data);
                        if (newVal == null) {
                            return;
                        }

                        scope.chart.draw({data:scope.data});
                    })



                }
            }
        };
        return directiveDefinitionObject;
    }
]);

directivesProvider.directive('postChart', ['getDataSvc',
    function factory(getDataSvc) {
        var directiveDefinitionObject = {
            template:
                '<div class="chart_container">'
                    +    ' <div class="chart" ></div>'
                    + '</div>',
            scope: {
                data : '=',
                datatimestamp : '='
            },
            restrict: 'E',
            transclude: 'false',
            replace: true,
            link: {
                post: function(scope, element, attrs) { // post-link function

                    scope.id=element.attr('id');

                    scope.chart=chartPost.chart();
                    console.log(scope.id, scope.chartsize);
                    scope.chart.init({elId: scope.id, chartSize : scope.chartsize, data: []});


                    console.log('postChart - post link function. Scope: ', scope, 'attrs', attrs);

                    scope.$watch('datatimestamp', function(newVal, oldVal){
                        console.log('post-Chart: scope.datatimestamp watch signalled', newVal, scope.data);
                        if (newVal == null) {
                            return;
                        }

                        scope.chart.draw({data:scope.data});

                    })



                }
            }
        };
        return directiveDefinitionObject;
    }
]);

directivesProvider.directive('multiPostChart', ['getDataSvc',
    function factory(getDataSvc) {
        var directiveDefinitionObject = {
            template:
                '<div class="chart_container">'
                    +    ' <div class="chart" ></div>'
                    + '</div>',
            scope: {
                data : '=',
                datatimestamp : '=',
                metric: '='
            },
            restrict: 'E',
            transclude: 'false',
            replace: true,
            link: {
                post: function(scope, element, attrs) { // post-link function

                    scope.id=element.attr('id');

                    scope.chart=chartMultiPost.chart();
                    console.log(scope.id, scope.chartsize);
                    scope.chart.init({elId: scope.id, chartSize : scope.chartsize, data: []});


                    console.log('multiPostChart - post link function. Scope: ', scope, 'attrs', attrs);

                    scope.$watch('datatimestamp', function(newVal, oldVal){
                        console.log('multiPostChart: scope.datatimestamp watch signalled', newVal, scope.data);
                        if (newVal == null) {
                            return;
                        }

                        scope.chart.draw({data:scope.data, metric: scope.metric});

                    })



                }
            }
        };
        return directiveDefinitionObject;
    }
]);