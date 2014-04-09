/*global angular:false, console:false, chartSnapsPerDay:false, chartMultiPost:false */


// requires


angular.module('mainApp').directive('spdChart', ['getDataSvc',
    function factory() {
        'use strict';
        //noinspection UnnecessaryLocalVariableJS
        var directiveDefinitionObject = {
            template: '<div class="chart_container">' +
                ' <div class="chart"></div>' +
                '</div>',
            scope: {
                data: '=',
                datatimestamp: '='
            },
            restrict: 'E',
            transclude: 'false',
            replace: true,
            link: {
                post: function (scope, element, attrs) { // post-link function

                    scope.id = element.attr('id');

                    scope.chart = chartSnapsPerDay.chart();
                    scope.chart.init({elId: scope.id, data: []});

                    scope.$watch('datatimestamp', function (newVal) {
                        if (newVal === null) {
                            return;
                        }

                        scope.chart.draw({data: scope.data});
                    });


                }
            }
        };
        return directiveDefinitionObject;
    }
]);

angular.module('mainApp').directive('multiPostChart', ['getDataSvc',
    function factory() {
        'use strict';
        //noinspection UnnecessaryLocalVariableJS
        var directiveDefinitionObject = {
            template: '<div class="chart_container">' +
                ' <div class="chart" ></div>' +
                '</div>',
            scope: {
                data: '=',
                datatimestamp: '=',
                metric: '=',
                rankRange: '=rankrange',
                chartNeedsUpdate: '=needsupdate'
            },
            restrict: 'E',
            transclude: 'false',
            replace: true,
            link: {
                post: function (scope, element) { // post-link function

                    scope.id = element.attr('id');

                    scope.chart = chartMultiPost.chart();
                    scope.chart.init({elId: scope.id, data: []});


                    scope.$watchCollection('[datatimestamp, metric, rankRange, chartNeedsUpdate]', function (newVals) {
                        if (newVals === null) {
                            return;
                        }

                        scope.chart.draw({data: scope.data, metric: scope.metric, rankRange: scope.rankRange});
                        scope.chartNeedsUpdate=false;
                    });
                }
            }
        };
        return directiveDefinitionObject;
    }
]);