'use strict';
/*global angular:false*/


angular.module('statesServiceProvider', [])
    .factory('statesService', function () {
        /**
         * Simple state manager.
         * Example:
         * var states = stateManger(
         * {data: ['updated', 'getNewData'], obj2: ['state1', 'state2', 'state3']}
         * , $scope)
         * states.set('data','getNewData')
         * if (states.is('data','getNewData')) {... go get new data ...}
         *
         * $scope = if a valid angular scope, it will BROADCAST an event upon any change of state. (to enable $scope.$on() )
         */


        function stateManager(statesInit, $scope) {
            var _states = {};

            for (var key in statesInit) {
                //noinspection JSUnfilteredForInLoop
                if (!Array.isArray(statesInit[key])) {
                    throw new Error('Improper initialization format. Must be {key1: [list], key2:[list]}. Received: ', JSON.stringify(statesInit, null, 4));
                }

                _states[key] = {};
                statesInit[key].forEach(function (s) {
                    _states[key][s] = false;
                });
            }

            function broadcast(obj, state) {
                if ($scope) {
                    $scope.$broadcast(obj, state);
                }
            }

            function errorCheck(obj, state) {
                if (!(obj in _states)) {
                    throw new Error('obj ' + obj + ' not in state list: ', _states);
                }

                if (!(state in _states[obj])) {
                    throw new Error('state ' + state + ' not in _states[obj]: ', _states[obj]);
                }
            }

            function set(obj, state) {
                errorCheck(obj, state);

                var oldVal = _states[obj][state];

                for (var s in _states[obj]) {
                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                    _states[obj][s] = (s === state);
                }

                if (oldVal !== _states[obj][state]) {
                    broadcast(obj, state);
                }

                return true;
            }

            function is(obj, state) {
                errorCheck(obj, state);

                return _states[obj][state];
            }

            function get(obj) {
                return _states[obj];
            }

            return {
                set: set,
                is: is,
                get : get
            };
        }

        return {
            stateManager: stateManager
        };
    });

