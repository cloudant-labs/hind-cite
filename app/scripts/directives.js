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

                        setTimeout(function(){
                            setInterval(function() {
                                var h=scope.data.history;
                                var l=h[h.length-1];
                                l.comments-=1;
                                l.rank-=1;
                                l.points-=1;
                                l.timestamp_d=new Date(l.timestamp_d.getTime()+1000*60*5);
                                h.push(l);
                                console.log('New Data: ', l);
                                scope.chart.draw({data:scope.data});
                            }, 1000);
                        }, 6000);


                    })



                }
            }
        };
        return directiveDefinitionObject;
    }
]);
// TODO - Make the chart update with new data (ie: keep it live)
