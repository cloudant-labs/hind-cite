'use strict';

var controllersProvider = angular.module('controllersProvider', ['servicesProvider']);

controllersProvider
    .controller('mainCtrl', ['$scope', '$log', function ($scope, $log) {
        $log.log('******************************************************************************');
        $log.log('Brought to you by Cloudant.com, an IBM Company');
        $log.log('Cloudant - Distributed database as a service');
        $log.log('******************************************************************************\n');

        $log.log('******************************************************************************');
        $log.log('Realtime search provided by Algolia -  http://www.algolia.com/console');
        $log.log('Algolia - POWERFUL REALTIME SEARCH API BUILT FOR DEVELOPERS');
        $log.log('******************************************************************************\n');

    }]);


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
        $scope.d.selectedId = null;

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

        $scope.$watch('d.selectedId', function (newVal, oldVal) {
            if ($scope.d.selectedId == null) return;

            console.log('postCtrl d.selectedId changed:', newVal);
            $scope.d.postid = $scope.d.selectedId;
        });


    }]);

controllersProvider
    .controller('multiPostCtrl', ['$scope', 'getDataSvc', '$location', function ($scope, getDataSvc, $location) {
        $scope.d = {};
        $scope.d.data = {};
        $scope.d.postIds = ['7415660', '7412612', '7422988', '7437940', '7439444'];
        $scope.d.postIdsText = '';  // Set in watch
        $scope.d.metric = 'rank';


        $scope.idsToText = function (idarray) {
            console.log('idsToText: ', idarray.join(','));
            return idarray.join(',');
        };

        $scope.textToIds = function (idtext) {
            var split = idtext.split(/[\s,;.]+/);
            var out = [];
            split.forEach(function (id) {
                id = id.replace(/ /g, '');
                if (/^[0-9]{7}$/.test(id)) {
                    out.push(id);
                }
            });

            console.log('textToIds: ', idtext, ' --> ', out);
            return out;

        };

        // Initialize ids based on url
        if ($location.search().postIds) {
            $scope.d.postIdsText = $location.search().postIds;
            $scope.d.postIds = $scope.textToIds($scope.d.postIdsText);
        }


        $scope.dateVal = function (dateStr) {
            return new Date(dateStr);
        };
        $scope.d.selectedId = null;

        $scope.numComments = function () {
            return sumHistRec($scope.d.data, 'comments');
        };
        $scope.numPoints = function () {
            return sumHistRec($scope.d.data, 'points');
        };


        console.log('multiPostCtrl - entering', $scope);

        $scope.$watchCollection('d.postIds', function (newVals, oldVals) {

            if (newVals == null) {
                return;
            }

            $scope.d.postIdsText = $scope.idsToText($scope.d.postIds);
            $scope.d.data = {};

            // Update url
            $location.search({postIds: $scope.idsToText($scope.d.postIds).replace(/ /g, '')});  // TODO - fix url

            $scope.d.postIds.forEach(function (id) {
                getDataSvc.getById(id, null, function success(data) {
                    console.log('multiPostCtrl - got data. for id [' + id + '] Raw: ', data);
                    $scope.$apply($scope.d.data[id] = data);
                    $scope.$apply($scope.d.data.timestamp = Date.now());
                });
            });
        });

        $scope.$watch('d.postIdsText', function (newVal) {
            if (newVal == null) {
                return;
            }

            $scope.d.postIds = $scope.textToIds($scope.d.postIdsText);
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
        var maxDelay = 2000, startTime = new Date();
        var intId = window.setInterval(function () {
            if (!$('#search-panel').length || !$('#hitTemplate').length) {
                if (Date.now() - startTime < maxDelay) {
                    return;
                } else {
                    console.log('*** Timing out initialization of hnsearchCtrl!');
                }
            }
            window.clearInterval(intId);
            console.log('Initializing hnsearch after delay: ', Date.now() - startTime);

            window.hnsearch = new HNSearch('UJ5WYC0L7X', '8ece23f8eb07cd25d40262a1764599b1', 'Item_production', 'User_production', $scope);
        }, 100);

        $scope.$watch('d.selectedId', function (newValue) {
            if (newValue == null) return;

            console.log('hnsearchCtrl: d.selectedIds watch fired: ', newValue);
        });
    }]);
// TODO - add selector for rank/points/comments
// TODO - Work on text-search selector for multiple
// TODO - Add statistics

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
