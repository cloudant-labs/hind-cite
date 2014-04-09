/*global $:false, angular:false, console:false, _:false, HNSearch:false */


angular.module('mainApp')
    .controller('mainCtrl', ['$scope', '$log', function ($scope, $log) {
        'use strict';
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
        'use strict';
        $scope.d = {};
        $scope.d.data = [];

        getDataSvc.getSnapshots({group: true}, function success(data) {
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
    'use strict';

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
        'use strict';
        $scope.d = {};
        $scope.d.data = {};
        $scope.d.postIds = [];  // Current list of fetched ids
        $scope.d.newIds = [];   // Ids that need to be added
        $scope.d.metric = 'rank';
        $scope.d.rankRange = 30;
        $scope.d.postListSelector = '["top","all"]';
        $scope.d.unfoundIds = [];

        var states = statesService.stateManager({
            data: ['needsData', 'dataUpdated'],
            chart: ['needsUpdate', 'chartUpdated'],
            url: ['needsUpdate', 'urlUpdated'],
            postIds: ['fromList', 'fromManual']
        }, $scope);

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
                out.push(id);
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


        /**
         *
         * @param postId - either a single id, or a list of ids
         */
        $scope.addPostId = function (postId) {
            var postIdList, changed = false;
            if (typeof(postId) === 'string') {
                postIdList = [postId];
            } else if (Array.isArray(postId)) {
                postIdList = postId;
            } else {
                throw new Error('Improper postId - must be single elemement or list of ids. Got: ', postId);
            }

            postIdList.forEach(function (pid) {
                if (_.contains($scope.d.postIds, pid)) {
                    return;
                }
                $scope.d.postIds.push(pid);
                changed = true;
            });

            if (changed) {
                states.set('postIds', 'fromManual');
                states.set('data', 'needsData');
                states.set('url', 'needsUpdate');
            }

        };
        $scope.addNewId = function (postId) {
            if (_.contains($scope.d.newIds, postId)) {
                return;
            }
            $scope.$apply($scope.d.newIds.push(postId));  // TODO - keep an eye on this - it has failed sporadically. Weird.
            if (!$scope.$$phase) {  // This can be called inside or outside of angular
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

        $scope.removePostId = function (postId) {
            $scope.d.postIds = _.without($scope.d.postIds, postId);
            if (postId in $scope.d.data) {
                delete $scope.d.data[postId];
            }
            if (!$scope.$$phase) {  // This can be called inside or outside of angular
                $scope.$digest();
            }
            states.set('postIds', 'fromManual');
            states.set('url', 'needsUpdate');
            states.set('chart', 'needsUpdate');
        };

        $scope.clearAllIds = function () {
            $scope.d.postIds = [];
            $scope.d.data = {};
            // TODO - BUG - NVD3 doesn't delete chart when data is empty
            states.set('postIds', 'fromManual');
            states.set('chart', 'needsUpdate');
            states.set('url', 'needsUpdate');
        };

        $scope.dataOnly = function () {
            var out = {};
            for (var key in $scope.d.data) {
                //noinspection JSUnfilteredForInLoop
                if (! /^timestamp$/.test(key)) {
                    //noinspection JSUnfilteredForInLoop
                    out[key] = $scope.d.data[key];
                }
            }
            return out;
        };

        // Given actual returned data, remove any postIds that were not found.
        $scope.updatePostIdsFromActual = function (data) {
            var keys = Object.keys(data);
            var actualIds = keys.map(function (key) {
                return data[key].id;
            });
            $scope.d.unfoundIds = _.difference($scope.d.postIds, actualIds);
            if ($scope.d.unfoundIds.length > 0) {
                $scope.d.postIds = _.difference($scope.d.postIds, $scope.d.unfoundIds);
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
                states.set('url', 'needsUpdate');
            }


        };

        $scope.resetHnSearch = function () {

            //noinspection JSJQueryEfficiency
            $('#inputfield input').val('').keyup();
        };

        function dropdownToQuery() {
            var fn, dateRange = null,
                dropdown = $parse($scope.d.postListSelector)();

            var numDays = dropdown[1];
            if (numDays === 'all') {
                dateRange = null;
            } else if (typeof(numDays) === 'number') {
                dateRange = [$filter('date')(new Date(Date.now() - numDays * 24 * 60 * 60 * 1000), 'yyyy-MM-dd HH:mm:ss'), '9999'];
            } else {
                throw new Error('Improper number of days for date limit:', numDays);
            }

            var limit = 10;  // TODO - make limit configurable

            if (dropdown[0] === 'top') {
                fn = 'getLatest';
            } else if (dropdown[0] === 'points') {
                fn = 'getByPoints';
            } else if (dropdown[0] === 'comments') {
                fn = 'getByComments';
            } else {
                throw new Error('Improper query type: ' + dropdown[0] + dropdown);
            }

            return {fn: fn, dateRange: dateRange, limit: limit};
        }


        //
        // Initialize from URL
        //
        if ($location.search().postIds) {
            $scope.d.newIds = $scope.textToIds($location.search().postIds);
            $scope.d.postListSelector = 'deselected';
            states.set('postIds', 'fromManual');
        } else if ($location.search().list) {
            var tmpl;
            if (!isNaN(Number($location.search().limit))) {
                tmpl = '["<%= list %>",<%= limit %>]';
            } else {
                tmpl = '["<%= list %>","<%= limit %>"]'; // quotes around limit
            }
            $scope.d.postListSelector = _.template(tmpl, {list: $location.search().list, limit: $location.search().limit});
            states.set('postIds', 'fromList');
        }

        function setUrl() {
            // No idea why I need to wrap the $location calls in a timeout. They are already in a $digest, but they aren't always getting rendered till the next digest. This fixes it.
            $timeout(function () {
                if (states.is('postIds', 'fromList')) {
                    var l = $parse($scope.d.postListSelector)();
                    if (l) {
                        $location.search({list: l[0], limit: l[1]}).replace();
                    }

                } else {
                    $location.search({postIds: $scope.idsToText($scope.d.postIds).replace(/ /g, '')}).replace();
                }
                states.set('url', 'urlUpdated');
            }, 1);

        }


        //
        //  Watches
        //


        $scope.$watch('d.postListSelector', function (newVal) {
            if (newVal === null || newVal === 'deselected') {
                return;
            }
            states.set('postIds', 'fromList');
            states.set('url', 'needsUpdate');
            states.set('data', 'needsData');
        });


        $scope.$watchCollection('d.newIds', function (newVals) {
            if (newVals === null || newVals.length === 0) {
                return;
            }

            $scope.addPostId($scope.d.newIds);

            $scope.d.newIds = [];
            states.set('postIds', 'fromManual');
            states.set('url', 'needsUpdate');
        });


        $scope.$on('data', function (event, arg) {
            if (arg !== 'needsData') {
                return;
            }

            if (states.is('postIds', 'fromManual')) {

                getDataSvc.getMultIds($scope.d.postIds, null, function success(data) {
                    $scope.d.data = {};
                    data.forEach(function (rec) {
                        $scope.$apply($scope.d.data[rec.id] = rec);
                    });
                    $scope.$apply($scope.d.data.timestamp = Date.now());
                    $scope.$apply($scope.d.requestByIdDirty = false);
                    states.set('data', 'dataUpdated');
                    states.set('url', 'needsUpdate');
                    $scope.updatePostIdsFromActual(data);
                });
            } else if (states.is('postIds', 'fromList')) {
                $scope.d.dropdownToQueryResult = dropdownToQuery();
                var q = dropdownToQuery();

                var successFn = function success(data) {
                    $scope.d.data = {};
                    $scope.d.postIds = [];
                    data.forEach(function (rec) {
                        $scope.d.data[rec.id] = rec;
                        $scope.d.postIds.push(rec.id);
                    });
                    $scope.d.data.timestamp = Date.now();
                    $scope.d.requestByLatestDirty = false;
                    states.set('data', 'dataUpdated');
                    states.set('url', 'needsUpdate');
                    $scope.updatePostIdsFromActual(data);
                    $scope.$digest();  // Do once
                };

                if (q.fn === 'getLatest') {
                    getDataSvc.getLatest(q.limit, null, successFn);
                } else if (q.fn === 'getByPoints') {
                    getDataSvc.getByPoints(q.dateRange, q.limit, null, successFn);
                } else if (q.fn === 'getByComments') {
                    getDataSvc.getByComments(q.dateRange, q.limit, null, successFn);
                } else {
                    throw new Error('Unexpected query fn: ', q.fn);
                }
            } else {
                throw new Error('on Data - unexpected postIds state:  ', states.get());
            }
        });

        $scope.$on('chart', function () {
            $scope.d.chartNeedsUpdate = states.is('chart', 'needsUpdate');  // Use a data element to easily communicate with chart directive

        });
        // If child directive is finished, update the state
        $scope.$watch('d.chartNeedsUpdate', function (newVal, oldVal) {
            if (newVal === null || newVal === oldVal) {
                return;
            }
            states.set('chart', !$scope.d.chartNeedsUpdate ? 'chartUpdated' : 'needsUpdate');
        });

        $scope.$on('url', function () {
            setUrl();
        });

        $scope.$on('postIds', function (event, arg) {
            if (arg === 'fromManual') {
                $scope.d.postListSelector = 'deselected';
            }
        });
    }]);

/**
 * Subservient controller, passing data back to parent via $scope.d.selectedId
 */
angular.module('mainApp')
    .controller('hnsearchCtrl', ['$scope', function ($scope) {
        'use strict';
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


    }]);

// TODO - Add statistics
// TODO - set order for post ids
// TODO - add comments/points selector to url


