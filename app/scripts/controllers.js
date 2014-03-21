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
        $scope.d.data = [];

        console.log('snapsPerDayCtrl - entering', $scope);

        getDataSvc.getSnapshots({group: true}, function success(data) {
            console.log('snapsPerDayCtrl - got data. Raw: ', data);
            $scope.$apply($scope.d.data = data.rows);
            $scope.$apply($scope.d.data.timestamp = Date.now());
        });

    }]);


controllersProvider
    .controller('postCtrl', ['$scope', 'getDataSvc', '$location', function ($scope, getDataSvc, $location) {
        $scope.d = {};
        $scope.d.data = {};
        $scope.d.postid = '7290931';
        $scope.dateVal = function (dateStr) {
            return new Date(dateStr);
        };
        $scope.d.selectedId=null;

        $scope.numComments = function () {
            return sumHistRec($scope.d.data, 'comments');
        };
        $scope.numPoints = function () {
            return sumHistRec($scope.d.data, 'points');
        };

        if ($location.search().postid) {
            $scope.d.postid = $location.search().postid;
        }

        console.log('postCtrl - entering', $scope);

        $scope.$watch('d.postid', function (newVal, oldVal) {

            if (newVal == null) {
                return;
            }

            // Update url
            $location.search({postid: $scope.d.postid});

            getDataSvc.getById($scope.d.postid, null, function success(data) {
                console.log('postCtrl - got data. Raw: ', data);
                $scope.$apply($scope.d.data = data);
                $scope.$apply($scope.d.data.timestamp = Date.now());
            });

        })

        $scope.$watch('d.selectedId', function(newVal, oldVal){
            if ($scope.d.selectedId == null) return;

            console.log('postCtrl d.selectedId changed:', newVal);
            $scope.d.postid=$scope.d.selectedId;
        });


    }]);

/**
 * Subservient controller, passing data back to parent via $scope.d.selectedId
 */
controllersProvider
    .controller('hnsearchCtrl', ['$scope', function ($scope) {
        $scope.d.selectedId = null;  // NOTE - this requires a parent controller with $scope.d={}

        console.log('hnsearchCtrl - entering', $scope);

        // Delay initializing HNsearch until all pieces are loaded
        var maxDelay=2000, startTime=new Date();
        var intId=window.setInterval(function () {
            if (! $('#search-panel').length || ! $('#hitTemplate').length){
                if (Date.now() - startTime < maxDelay) {
                    return;
                } else {
                    console.log('*** Timing out initialization of hnsearchCtrl!');
                }
            }
            window.clearInterval(intId);
            console.log('Initializing hnsearch after delay: ', Date.now()-startTime);

            window.hnsearch = new HNSearch('UJ5WYC0L7X', '8ece23f8eb07cd25d40262a1764599b1', 'Item_production', 'User_production', $scope);
        }, 100);

        $scope.$watch('d.selectedId', function (newValue) {
            if (newValue == null) return;

            console.log('hnsearchCtrl: d.selectedIds watch fired: ', newValue);
        });


    }]);

/** Returns max value of field in data.history
 *
 * @param data - result of getSnapshots
 * @param field - a field (string) in data.history
 * @returns {number}
 * @example sumHist($scope.d.data, 'comments') --> 25
 */
function sumHistRec(data, field) {

    if (!data || !data.history) {
        return 0
    }

    var maxVal = 0;
    data.history.forEach(function (d) {
        maxVal = Math.max(maxVal, 0 || d[field]);
    });
    return maxVal;
}
