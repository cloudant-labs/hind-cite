'use strict';
/*global $:false, angular:false, console:false, _:false, HNSearch:false */




angular.module('mainApp')
    .controller('mainCtrl', ['$scope', '$log', function ($scope, $log, statesServices) {
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

/** Returns max value of field in data.history
 *
 * @param data - result of getSnapshots
 * @param field - a field (string) in data.history
 * @returns {number}
 * @example sumHist($scope.d.data, 'comments') --> 25
 */
function sumHistRec(data, field) {

    if (!data || !data.history) {
        return 0;
    }

    var maxVal = 0;
    data.history.forEach(function (d) {
        maxVal = Math.max(maxVal, 0 || d[field]);
    });
    return maxVal;
}

angular.module('mainApp')
    .controller('multiPostCtrl', ['$scope', 'getDataSvc', '$location', '$timeout', '$filter', '$parse', 'statesService', function ($scope, getDataSvc, $location, $timeout, $filter, $parse, statesService) {
        $scope.d = {};
        $scope.d.data = {};
        $scope.d.postIds = [];  // Current list of fetched ids
        $scope.d.newIds = [];   // Ids that need to be added
        $scope.d.metric = 'rank';
        $scope.d.rankRange=30;
        $scope.d.addByDropdown = '10';
        $scope.d.dropdownIdsOnly = true;  // clean if no ids added / removed from list
        $scope.d.selectedId = null;
        $scope.d.requestByIdDirty = false;
        $scope.d.requestByLatestDirty = false;
        var states=statesService.stateManager({
            data :    ['needsData', 'dataUpdated'],
            chart:    ['needsUpdate', 'chartUpdated'],
            url :     ['needsUpdated', 'urlUpdated'],
            postIds : ['fromList', 'fromManual']
        });

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
            states.set('postIds', 'fromManual');
            states.set('data', 'needsData');
        };
        $scope.addNewId = function (postId) {
            if (_.contains($scope.d.newIds, postId)) {
                return;
            }
            $scope.$apply($scope.d.newIds.push(postId));  // TODO - keep an eye on this - it has failed sporadically. Weird.
            if(!$scope.$$phase) {  // This can be called inside or outside of angular
                $scope.$digest();
            }
        };
        $scope.removeFromNewIds = function (postId) {
            $scope.$apply($scope.d.newIds = _.without($scope.d.newIds, postId));
        };
        $scope.submitPostIdsText = function () {
            var newIds = $scope.textToIds($scope.d.postIdsText);
            $scope.d.newIds = _.union($scope.d.newIds, newIds);
            $scope.d.postIdsText = '';
        };

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
            if(!$scope.$$phase) {  // This can be called inside or outside of angular
                $scope.$digest();
            }
            states.set('postIds', 'fromManual');
            states.set('chart', 'needsUpdate');
        };

        $scope.clearAllIds = function () {
            $scope.d.postIds = [];
            setDropdownIdsModified();
            $scope.d.requestByIdDirty = true;
            // TODO - BUG - NVD3 doesn't delete chart when data is empty
            states.set('postIds', 'fromManual');
            states.set('chart', 'needsUpdate');
        };

        $scope.dataOnly = function () {
            var out = {};
            for (var key in $scope.d.data) {
                //noinspection JSUnfilteredForInLoop
                if (/^[0-9]{7}$/.test(key)) {
                    //noinspection JSUnfilteredForInLoop
                    out[key] = $scope.d.data[key];
                }
            }
            return out;
        };

        function dropdownToQuery(){
            var fn, query, field, dateRange=null, numRecs=30,
                dropdown = $parse($scope.d.addByDropdown)(),
                otherParams={};

            var numDays=dropdown[1];
            if (numDays==='all') {
                dateRange=null;
            } else if (typeof(numDays)==='number'){
                dateRange=[$filter('date')(new  Date(Date.now()-numDays*24*60*60*1000),'yyyy-MM-dd HH:mm:ss'), '9999'];
            } else {
                throw new Error('Improper number of days for date limit:', numDays);
            }

            var limit=30;  // TODO - make limit configurable

            if (dropdown[0]==='top') {
                fn=getDataSvc.getLatest;
            } else if (dropdown[0]==='points') {
                fn=getDataSvc.getByPoints;
            } else if (dropdown[0]==='comments') {
                fn=getDataSvc.getByComments;
            } else {
                throw new Error ('Improper query type: ', dropdown[0], dropdown);
            }

            return {fn: fn, dateRange: dateRange, limit:limit};
        }


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
            // No idea why I need to wrap the $location calls in a timeout. They are already in a $digest, but they aren't always getting rendered till the next digest. This fixes it.
            $timeout(function () {
                if ($scope.d.dropdownIdsOnly && $scope.d.addByDropdown !== 'deselected') {
                    $location.search({list: $scope.d.addByDropdown}).replace();
                } else {
                    $location.search({postIds: $scope.idsToText($scope.d.postIds).replace(/ /g, '')}).replace();
                }
            }, 1);

        }


        //
        //  Watches
        //



        $scope.$watch('d.addByDropdown', function (newVal) {
            if (newVal === null || newVal === 'deselected') {
                return;
            }

            console.log('dropdownToQuery: ', dropdownToQuery());
            return;

            setDropdownIdsOnly();
            states.set('postIds', 'fromList');
            states.set('data', 'needsData');

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


        $scope.$watchCollection('d.newIds', function (newVals) {
            if (newVals === null || newVals.length === 0) {
                return;
            }
            $scope.d.newIds.forEach(function (postId) {
                $scope.addPostId(postId);
            });

            $scope.d.newIds = [];
            setDropdownIdsModified();
        });

        $scope.$watch('d.requestByIdDirty', function (newVal) {

            if (newVal === null || !newVal) {
                return;
            }

            $scope.d.data = {};

            getDataSvc.getMultIds($scope.d.postIds, null, function success(data) {
                console.log('multiPostCtrl - getMultIds - got data: ', data);
                data.forEach(function (rec) {
                    $scope.$apply($scope.d.data[rec.id] = rec);
                });
                $scope.$apply($scope.d.data.timestamp = Date.now());
                $scope.$apply($scope.d.requestByIdDirty = false);
            });
        });

        $scope.$watchCollection('d.postIds', function () {
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
            if (newValue === null) {
                return;
            }

            console.log('hnsearchCtrl: d.selectedIds watch fired: ', newValue);
            // TODO - REMOVE selectedId
        });
    }]);

// TODO - Add statistics
// TODO - set order for post ids
// TODO - add comments/points selector to url


