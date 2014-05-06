'use strict';
/* global logit:false, getData:false*/




// All the below should return the same record format
function testRecFormat(rec) {
    expect(rec.doc_type).toBe('post');
    expect(rec.stats.minRank).toBeLessThan(61);
    expect(rec.created_d instanceof Date).toBeTruthy();
    expect(rec.history.length).toBeGreaterThan(0);
    expect(rec.history[0].created_d instanceof Date).toBeTruthy();
    expect(rec.history[0].timestamp_d instanceof Date).toBeTruthy();
}

function testAllRecsFormat(recs) {
    recs.forEach(function (rec) {
        testRecFormat(rec);
    });
}


var testCases = [
    {
        name: 'getMultIds',
        func: getData.getMultIds,
        args: [
            ['7373566', '7216471', '7566069'],
            {}
        ],
        fixture: 'getMultIds.json'
    },
    {
        name: 'getByPoints',
        func: getData.getByPoints,
        args: [
            ['2014-01-01', '2014-04-15'],
            3,
            {}
        ],
        fixture: 'getByPoints.json'
    },
    {
        name: 'getByComments',
        func: getData.getByComments,
        args: [
            ['2014-01-01', '2014-04-15'],
            3,
            {}
        ],
        fixture: 'getByComments.json'
    }
];

/*
 Testing setup:
 npm - install karma-ng-html2js-preprocessor/  (but NOT same w/o 'ng' !)
 karma.conf - set up as in my file (moduleName: cachedFiles, cachedIdFromPath, file watch, etc.)
 Use module() and inject() and $templateCache.get, as below

 If things don't work:
 karma.conf: logLevel: config.LOG_DEBUG
 karma-ng-html2js-preprocessor: modify the code with good logging, or run in npm debug mode
 Chances are the file names aren't syncing up.

 */

function doTestCases(cases) {
    cases.forEach(function (testCase) {
        describe(testCase.name + ' works', function () {
            var retVal, done, fixture;

            beforeEach(function () {
                retVal = {};
                done = false;
                module('cachedFiles');
                inject(function ($templateCache) {
                    fixture = $templateCache.get(testCase.fixture);
                });
            });

            it('returns proper data', function () {
                runs(function () {
                    var success = function (data) {
                            retVal = data;
                            done = true;
                        },
                        error = function () {
                            retVal = 'ERROR';
                            done = true;
                        },
                        allArgs = testCase.args.slice().concat(success, error);
                    testCase.func.apply(this, allArgs);
                });


                waitsFor(function () {
                    return done;
                }, 'timed out', 6000);

                runs(function () {
                    testAllRecsFormat(retVal);
                    expect(JSON.stringify(retVal)).toEqual(fixture);
                });
            });
        });
    });
}


var testParams = {group: true, startkey: '2014-03-01', limit: 2},
    viewResults = {'rows': [
        {'key': '2014-03-01', 'value': 17160},
        {'key': '2014-03-02', 'value': 17220}
    ]};

describe('getData Formatting', function () {

    it('paramsToQuery: should return a properly formatted query string for couch', function () {
        expect(getData.paramsToQuery(testParams)).toBe('group=true&startkey="2014-03-01"&limit=2');
        expect(function () {
            getData.paramsToQuery('String');
        }).toThrow();
    });

    it('createSnapsUrl: should create proper snapshot view url', function () {
        expect(getData.createSnapsUrl(testParams)).toBe(
            'https://cs.cloudant.com/news/_design/by/_view/snaps-per-day?group=true&startkey="2014-03-01"&limit=2');
    });
});


describe('getSnapshots return values are correct', function () {
    var retVal, done;

    beforeEach(function () {
        retVal = {};
        done = false;
    });


    it('getSnapshots should return proper data', function () {
        runs(function () {
            getData.getSnapshots(testParams, function (data) {
                retVal = data;
                done = true;
            }, function () {
                retVal = 'ERROR';
                done = true;
            });
        });


        waitsFor(function () {
            return done;
        }, 'timed out', 1000);

        runs(function () {
            expect(retVal).toEqual(viewResults);
        });

    });

});


describe('getLatest works', function () {
    var retVal, done;

    beforeEach(function () {
        retVal = {};
        done = false;
    });


    it('returns proper data', function () {
        runs(function () {
            getData.getLatest(5, {}, function (data) {
                retVal = data;
                logit('MANUAL: Compare the following list with HackerNews Page 1 (should be similar)');
                logit('rank\t\ttitle');
                logit('====\t\t==============');
                retVal.forEach(function (rec, i) {
                    logit('    '.substring(0, 4 - (String(i).length)) + i + '\t\t' + rec.title);
                });
                done = true;
            }, function () {
                retVal = 'ERROR';
                done = true;
            });
        });


        waitsFor(function () {
            return done;
        }, 'timed out', 3500);

        runs(function () {
            expect(retVal.length).toEqual(5);
            expect(retVal[0].history[retVal[0].history.length - 1].rank).toEqual(1);
            expect(retVal[4].history[retVal[4].history.length - 1].rank).toEqual(5);
            testAllRecsFormat(retVal);
        });

    });

});


// This runs multiple test cases
doTestCases(testCases);

