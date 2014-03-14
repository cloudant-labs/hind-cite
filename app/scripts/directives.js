'use strict';

// requires

var directivesProvider=angular.module('directivesProvider', ['servicesProvider']);

directivesProvider.directive('spdChart', ['getDataSvc',
    function factory(getDataSvc) {
        var directiveDefinitionObject = {
            template: '<div>' + '<h2>This is the histChartDirective</h2>'
                + 'data: ==>{{data}}<== </br>'
                + '<div> <div class="y_axis"></div><div class="chart"></div></div>'
                +'</div>',
            scope: {
                title : '@',
                data : '=',
                datatimestamp : '='
            },
            restrict: 'E',
            transclude: 'false',
            replace: true,
            link: {
                post: function(scope, element, attrs) { // post-link function

                    scope.id=element.attr('id');

                    scope.chart=chartSnapsPerDay.snapsPerDay();
                    scope.chartsize=config[attrs.chartsize];  // TODO don't hardcode this link to config?
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