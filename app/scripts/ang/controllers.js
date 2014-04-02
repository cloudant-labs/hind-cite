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
        $scope.d.postIds = [];  // Current list of fetched ids
        $scope.d.newIds = [];   // Ids that need to be added
        $scope.d.tmpIds=[];     // Holding pen (for hnsearch control)
        $scope.d.metric = 'rank';
        $scope.d.addByDropdown = "10";
        $scope.d.dropdownIdsOnly = true;  // clean if no ids added / removed from list
        $scope.d.selectedId = null;
        $scope.d.requestByIdDirty = false;
        $scope.d.requestByLatestDirty = false;

        //
        // Simple Support Functions
        //

        $scope.idsToText = function (idarray) {
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

            return out;

        };

        $scope.dateVal = function (dateStr) {
            return new Date(dateStr);
        };

        $scope.numComments = function () {
            return sumHistRec($scope.d.data, 'comments');
        };
        $scope.numPoints = function () {
            return sumHistRec($scope.d.data, 'points');
        };


        $scope.addPostId = function (postId) {
            if (_.contains($scope.d.postIds, postId)) {
                return;
            }

            $scope.d.postIds.push(postId);
            $scope.d.requestByIdDirty = true;
        };

        $scope.addNewIdText = function (postIdText) {
            $scope.$apply($scope.d.newIds = $scope.d.newIds.concat($scope.textToIds(postIdText)));
        };

        $scope.addToTmpIds = function(postId){
            if (_.contains($scope.d.tmpIds, postId)) {
                return;
            }
            $scope.d.tmpIds.push(postId);
        }
        $scope.removeFromTmpIds = function(postId){
            $scope.d.tmpIds = _.without($scope.d.tmpIds, postId);
        }
        $scope.submitTmpIds = function() {
            $scope.$apply($scope.d.newIds=$scope.d.newIds.concat($scope.d.tmpIds));
            $scope.d.tmpIds=[];
        }
        function setDropdownIdsModified() {
            $scope.d.dropdownIdsOnly = false;
            $scope.d.addByDropdown = 'deselected';
        }

        function setDropdownIdsOnly() {
            $scope.d.dropdownIdsOnly = true;
        }

        $scope.removePostId = function (postId) {
            $scope.d.postIds = _.without($scope.d.postIds, postId);
            setDropdownIdsModified();
            $scope.d.requestByIdDirty = true;
        };

        $scope.clearAllIds = function () {
            $scope.d.postIds = [];
            setDropdownIdsModified();
            $scope.d.requestByIdDirty = true;
            // TODO - BUG - NVD3 doesn't delete chart when data is empty
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


        //
        // Initialize from URL
        //
        if ($location.search().postIds) {
            $scope.d.newIds = $scope.textToIds($location.search().postIds);
            setDropdownIdsModified();
            $scope.d.requestByIdDirty = true;
        } else if ($location.search().list) {
            $scope.d.addByDropdown = $location.search().list;
            $scope.d.dropdownIdsOnly = true;
            $scope.d.requestByLatestDirty = true;
        }


        function setUrl() {
            if ($scope.d.dropdownIdsOnly && $scope.d.addByDropdown !== 'deselected') {
                $location.search({list: $scope.d.addByDropdown});
            } else {
                $location.search({postIds: $scope.idsToText($scope.d.postIds).replace(/ /g, '')});  // TODO - fix url
            }
        }


        //
        //  Watches
        //


        $scope.$watch('d.addByDropdown', function (newVal) {
            if (newVal == null || newVal == 'deselected') {
                return;
            }
            setDropdownIdsOnly();

            getDataSvc.getLatest(Number($scope.d.addByDropdown), null, function success(data) {
                console.log('multiPostCtrl - getLatest - got data. ', Number($scope.d.addByDropdown), data);
                $scope.d.data = {};
                $scope.d.postIds = [];
                data.forEach(function (rec) {
                    $scope.d.data[rec.id] = rec;
                    $scope.d.postIds.push(rec.id);
                });
                $scope.d.data.timestamp = Date.now();
                $scope.d.requestByLatestDirty = false;
                $scope.$digest();  // Do once
            });
        });


        $scope.$watchCollection("d.newIds", function (newVals) {
            if (newVals == null || newVals.length == 0) {
                return;
            }
            $scope.d.newIds.forEach(function (postId) {
                $scope.addPostId(postId);
            });

            $scope.d.newIds = [];
            setDropdownIdsModified();
        });

        $scope.$watch('d.requestByIdDirty', function (newVal) {

            if (newVal == null || ! newVal) {
                return;
            }

            $scope.d.data = {};

            getDataSvc.getMultIds($scope.d.postIds, null, function success(data) {
                console.log('multiPostCtrl - getMultIds - got data: ', data);
                data.forEach(function (rec) {
                    $scope.$apply($scope.d.data[rec.id] = rec);
                });
                $scope.$apply($scope.d.data.timestamp = Date.now());
                $scope.$apply($scope.d.requestByIdDirty=false);
            });
        });

        $scope.$watchCollection('[d.dropdownIdsOnly, d.addByDropdown, d.postIds]', function (newVals) {
            if (newVals === null) {
                return;
            }
            setUrl();
        });

    }]);

/**
 * Subservient controller, passing data back to parent via $scope.d.selectedId
 */
angular.module('mainApp')
    .controller('hnsearchCtrl', ['$scope', function ($scope) {
        $scope.d.selectedId = null;  // NOTE - this requires a parent controller with $scope.d={}

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
