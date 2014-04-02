'use strict';

// requires


angular.module('mainApp').directive('spdChart', ['getDataSvc',
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

angular.module('mainApp').directive('multiPostChart', ['getDataSvc',
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
                    scope.chart.init({elId: scope.id, chartSize : scope.chartsize, data: []});


                    scope.$watch('datatimestamp', function(newVal, oldVal){
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