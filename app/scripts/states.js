'use strict';
/* exported states */


var statesModule=(function(){

    /**
     * Simple state manager.
     * Example:
     * var states = stateManger({data: ['updated', 'getNewData'], obj2: ['state1', 'state2', 'state3']})
     * states.set('data','getNewData')
     * if (states.is('data','getNewData')) {... go get new data ...}
     */

    function stateManager(statesInit) {
        var _states={};

        for (var key in statesInit) {
            if (! Array.isArray(statesInit[key])) {
                throw new Error('Improper initialization format. Must be {key1: [list], key2:[list]}. Received: ', JSON.stringify(statesInit,null,4));
            }

            _states[key]={};
            statesInit[key].forEach(function(s){
              _states[key][s]=false;
            });
        }

        function errorCheck(obj, state) {
            if (! (obj in _states)) {
                throw new Error('obj '+ obj + ' not in state list: ', _states);
            }

            if (! (state in _states[obj])) {
                throw new Error('state '+ state + ' not in _states[obj]: ', _states[obj]);
            }
        }

        function set(obj, state) {
            errorCheck(obj, state);

            for (var s in _states[obj]) {
                if (s===state) {
                    _states[obj][s] = true;
                } else {
                    _states[obj][s] = false;
                }
            }
            return true;
        }

        function is(obj, state) {
            errorCheck(obj, state);

            return _states[obj][state];
        }

        return {
            set : set,
            is : is
        };
    }

    return {
        stateManager : stateManager
    };


}());