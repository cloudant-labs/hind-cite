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
    .controller('postCtrl', ['$scope', 'getDataSvc', '$location', function ($scope, getDataSvc, $location) {
        $scope.d = {};
        $scope.d.data={};
        $scope.d.postid='7290931';
        $scope.dateVal=function(dateStr) {return new Date(dateStr); };
        $scope.numComments=function()
            {return sumHistRec($scope.d.data, 'comments');
        };
        $scope.numPoints=function()
            {return sumHistRec($scope.d.data, 'points');
        };

        if ($location.search().postid) {
            $scope.d.postid=$location.search().postid;
        }

        console.log('postCtrl - entering', $scope);

        $scope.$watch('d.postid', function(newVal, oldVal){

            if (newVal == null) {
                return;
            }

            // Update url
            $location.search({postid : $scope.d.postid});

            getDataSvc.getById($scope.d.postid,null, function success(data) {
                console.log('postCtrl - got data. Raw: ', data );
                $scope.$apply($scope.d.data=data.rows[0].value);
                $scope.$apply($scope.d.data.timestamp=Date.now());
            });

        })


    }]);

/** Returns max value of field in data.history
 *
 * @param data - result of getSnapshots
 * @param field - a field (string) in data.history
 * @returns {number}
 * @example sumHist($scope.d.data, 'comments') --> 25
 */
function sumHistRec(data, field){

    if (!data || !data.history) {
        return 0
    }

    var maxVal=0;
    data.history.forEach(function(d){
        maxVal = Math.max(maxVal, 0 || d[field]);
    });
    return maxVal;
}
