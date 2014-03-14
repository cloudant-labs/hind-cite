'use strict';

var controllersProvider = angular.module('controllersProvider', ['servicesProvider']);

controllersProvider
    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });


controllersProvider
    .controller('snapsPerDayCtrl', ['$scope', 'getDataSvc', function ($scope, getDataSvc) {
        $scope.d = {};
        $scope.d.data=[];

        console.log('snapsPerDayCtrl - entering', $scope);

        getDataSvc.getSnapshots({group:true}, function success(data) {
            console.log('snapsPerDayCtrl - got data. Raw: ', data );
            $scope.$apply($scope.d.data=data.rows);
            $scope.$apply($scope.d.data.timestamp=Date.now());
        });

        $scope.$watch('d.data', function(newVal, oldVal) {
            console.log('snapsPerDayCtrl - in d.data watch', newVal, oldVal);
            if (newVal == null) {
                return;
            }
            // Do I need to do this?
        });

    }]);