'use strict';


angular.module('mainApp')
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


angular.module('mainApp')
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


angular.module('mainApp')
    .controller('multiPostCtrl', ['$scope', 'getDataSvc', '$location', function ($scope, getDataSvc, $location) {
        $scope.d = {};
        $scope.d.data = {};
        $scope.d.postIds = [];
        $scope.d.postIdsText = '';  // Set in watch
        $scope.d.metric = 'rank';
        $scope.d.topN = "10";

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
        } else if ($location.search().topN) {
            $scope.d.topN=$location.search().topN;
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

        $scope.addPostId = function (postId) {
            $scope.$apply($scope.d.postIds.push(postId));
        };

        $scope.removePostId = function (postId) {
            $scope.$apply($scope.d.postIds = $scope.d.postIds.filter(function (val) {
                return val !== postId;
            }));
        };

        $scope.dataOnly = function () {
            var out = {};
            for (var key in $scope.d.data) {
                if (/^[0-9]{7}$/.test(key)) {
                    out[key] = $scope.d.data[key];
                }
            }
            return out;
        };

        function setUrl(method) {
            if (method == 'idlist') {
                $location.search({postIds: $scope.idsToText($scope.d.postIds).replace(/ /g, '')});  // TODO - fix url

            } else if (method == 'dropdown') {
                $location.search({topN: $scope.d.topN});
            } else {
                throw new Error('multiPostCtrl.setUrl - improper method:', method);
            }
        }

        console.log('multiPostCtrl - entering', $scope);

        $scope.$watchCollection('d.postIds', function (newVals, oldVals) {

            if (newVals == null || $scope.d.postIds.length === 0) {
                return;
            }

            $scope.d.postIdsText = $scope.idsToText($scope.d.postIds);
            $scope.d.data = {};
            $scope.d.topN = 'deselected';

            getDataSvc.getMultIds($scope.d.postIds, null, function success(data) {
                console.log('multiPostCtrl - got data. Raw: ', data);
                data.forEach(function (rec) {
                    $scope.$apply($scope.d.data[rec.id] = rec);
                });
                $scope.$apply($scope.d.data.timestamp = Date.now());
            });
        });

        $scope.$watch('d.postIdsText', function (newVal) {
            if (newVal == null) {
                return;
            }

            $scope.d.postIds = $scope.textToIds($scope.d.postIdsText);
        });

        $scope.$watch('d.topN', function (newVal) {
            if (newVal == null || newVal == 'deselected') {
                return;
            }
            $scope.d.postIds=[];

            getDataSvc.getLatest(Number($scope.d.topN), null, function success(data) {
                console.log('multiPostCtrl - got data. Raw: ', data);
                $scope.d.data={};
                data.forEach(function (rec) {
                    $scope.$apply($scope.d.data[rec.id] = rec);
                });
                $scope.$apply($scope.d.data.timestamp = Date.now());
            });
        });

        // Set url  (do in one place, so it doesn't keep overwriting itself)
        $scope.$watchCollection('[d.postIds, d.topN]', function(newVals){
           if (newVals==null){
               return;
           }
           if ($scope.d.postIds.length > 0) {
               setUrl('idlist');
           } else if ($scope.d.topN !== 'deselected') {
               setUrl('dropdown')
           }
        });


    }]);

/**
 * Subservient controller, passing data back to parent via $scope.d.selectedId
 */
angular.module('mainApp')
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
