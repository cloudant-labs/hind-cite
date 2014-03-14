'use strict';

// requires

var directivesProvider=angular.module('directivesProvider', ['servicesProvider']);

directivesProvider.directive('histChart', ['getDataSvc',
    function factory(getDataSvc) {
        var directiveDefinitionObject = {
            template: '<div>' + '<h2>This is the histChartDirective</h2>'
                + 'data: ==>{{data}}<== </br>'
                + 'ng-transclude: <div ng-transclude></div></br>'
                +'</div>',
            scope: {
            },
            restrict: 'E',
            transclude: 'false',
            replace: true,
            link: {
                post: function(scope, element, attrs) { // post-link function
                    console.log('histChart directive - post link function');
                    scope.data='Uninitialized data';

                    getDataSvc.getSnapshots({group:true}, function(data){
                        console.log('getSnapshotsSuccess called', data);
                        scope.$apply(scope.data=data);
                    })
                }
            }
        };
        return directiveDefinitionObject;
    }
]);