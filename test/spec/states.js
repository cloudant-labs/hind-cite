'use strict';
/* global statesModule:false, describe:false, it:false, expect:false, beforeEach:false */

var initStates = {
    data: ['getData', 'dataUpdated'],
    url: ['needsUpdate', 'urlUpdated'],
    obj: ['state1', 'state2', 'state3']
};

describe('stateManager initialization works', function () {
    it('should succeed', function () {
        expect(typeof(statesModule.stateManager(initStates))).toBe('object');
    });
    it('should fail', function () {
        expect(function () {
            statesModule.stateManager(['state1', 'state2']);
        }).toThrow();
        expect(function () {
            statesModule.stateManager({obj1: 'state1', obj2: 'state2'});
        }).toThrow();
        expect(function () {
            statesModule.stateManager({obj1: {a: 10, b: 20}, obj2: {a: 10, b: 20}});
        }).toThrow();
    });
});

describe('stateManager works', function () {
    var states;

    beforeEach(function () {
        states = statesModule.stateManager(initStates);
    });

    it('should succeed', function () {
        expect(states.is('data', 'getData')).toBe(false);
        expect(states.set('data', 'getData')).toBe(true);
        expect(states.is('data', 'getData')).toBe(true);
    });

    it('should fail', function () {
        expect(function(){states.is('xxx','getData')}).toThrow();
        expect(function(){states.is('data','XXX')}).toThrow();
        expect(function(){states.set('xxx','getData')}).toThrow();
        expect(function(){states.set('data','XXX')}).toThrow();
    });


});