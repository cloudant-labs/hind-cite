'use strict';

var initStates = {
    data: ['getData', 'dataUpdated'],
    url: ['needsUpdate', 'urlUpdated'],
    obj: ['state1', 'state2', 'state3']
};

describe('stateManager initialization works', function () {
    it('should succeed', function () {
        expect(typeof(states.stateManager(initStates))).toBe('object');
    });
    it('should fail', function () {
        expect(typeof(states.stateManager(['state1', 'state2']))).toThrow();
        expect(typeof(states.stateManager({obj1:'state1', obj2: 'state2'}))).toThrow();
        expect(typeof(states.stateManager({obj1: {a:10, b:20}, obj2: {a:10, b:20}}))).toThrow();
    });
});

describe('stateManager works', function () {


    beforeEach(function () {
        var states = states.stateManager(initStates);
    });

    it('paramsToQuery: should return a properly formatted query string for couch', function () {
        expect(getData.paramsToQuery(testParams)).toBe('group=true&startkey="2014-03-01"&limit=2');
        expect(function () {
            getData.paramsToQuery('String')
        }).toThrow();
    });

    it('createSnapsUrl: should create proper snapshot view url', function () {
        expect(getData.createSnapsUrl(testParams)).toBe(
            'https://cs.cloudant.com/news/_design/by/_view/snaps-per-day?group=true&startkey="2014-03-01"&limit=2');
    });


});