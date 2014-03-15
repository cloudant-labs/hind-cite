'use strict';

var controllersProvider = angular.module('controllersProvider', ['servicesProvider']);

controllersProvider
    .controller('mainCtrl', function ($scope) {
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

    }]);

controllersProvider
    .controller('postCtrl', ['$scope', 'getDataSvc', function ($scope, getDataSvc) {
        $scope.d = {};
        $scope.d.data=[];
        $scope.d.id='7290931';

        console.log('postCtrl - entering', $scope);

        getDataSvc.getById($scope.d.id,null, function success(data) {
            console.log('postCtrl - got data. Raw: ', data );
            $scope.$apply($scope.d.data=data.rows);
            $scope.$apply($scope.d.data.timestamp=Date.now());
        });

    }]);