'use strict';
/* global statesModule:false, describe:false, it:false, expect:false, beforeEach:false */

var initStates = {
    data: ['getData', 'dataUpdated'],
    url: ['needsUpdate', 'urlUpdated'],
    obj: ['state1', 'state2', 'state3']
};

describe('stateManager initialization works', function () {
    var statesService;
    beforeEach(function () {
        module('statesServiceProvider');
        inject(function (_statesService_) {
            statesService = _statesService_;
        });
    });

    it('should succeed', function () {
        expect(typeof(statesService.stateManager(initStates))).toBe('object');
    });
    it('should fail', function () {
        expect(function () {
            statesService.stateManager(['state1', 'state2']);
        }).toThrow();
        expect(function () {
            statesService.stateManager({obj1: 'state1', obj2: 'state2'});
        }).toThrow();
        expect(function () {
            statesService.stateManager({obj1: {a: 10, b: 20}, obj2: {a: 10, b: 20}});
        }).toThrow();
    });
});

describe('stateManager works', function () {
    var states;
    var statesService;

    beforeEach(function () {
        module('statesServiceProvider');
        inject(function (_statesService_) {
            statesService = _statesService_;
        });
        states = statesService.stateManager(initStates);
    });

    it('should succeed', function () {
        expect(states.is('data', 'getData')).toBe(false);
        expect(states.set('data', 'getData')).toBe(true);
        expect(states.is('data', 'getData')).toBe(true);
    });

    it('should fail', function () {
        expect(function () {
            states.is('xxx', 'getData')
        }).toThrow();
        expect(function () {
            states.is('data', 'XXX')
        }).toThrow();
        expect(function () {
            states.set('xxx', 'getData')
        }).toThrow();
        expect(function () {
            states.set('data', 'XXX')
        }).toThrow();
    });


});