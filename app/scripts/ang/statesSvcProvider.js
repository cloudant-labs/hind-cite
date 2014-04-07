'use strict';
/*global angular:false,*/


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

        console.log('statesServicesProvicer: in factory');

        function stateManager(statesInit, $scope) {
            console.log('stateManager - initializing: ', statesInit, $scope);

            var _states = {};

            for (var key in statesInit) {
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
                    console.log('>>>stateManager: broadcasting event: '+ obj + '/' + state + ' to scope: ',$scope.$id);
                    $scope.$broadcast(obj, state);
                    //$scope.$emit(obj, state);  // TODO - just broadcast, probably


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

                for (var s in _states[obj]) {
                    _states[obj][s] = (s === state);
                }

                broadcast(obj, state);
                return true;
            }

            function is(obj, state) {
                errorCheck(obj, state);

                return _states[obj][state];
            }

            return {
                set: set,
                is: is
            };
        }

        return {
            stateManager: stateManager
        };
    });

