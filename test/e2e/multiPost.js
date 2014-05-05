'use strict';

var n = require('./helpers/navbar.js');
var _und = require('../../app/bower_components/underscore/underscore.js')

/**
 * returns promise for a boolean
 *  - true if table(id=postDataTable) column = colModelText (eg: 'stats.lastRank') matches
 *    the compareFn
 *
 * colModelText: the model name (eg: 'stats.lastRank')
 * compareFn(columnArray)
 *   - input is an array that has the resolved data for the column.
 */

function compareCol(colModelText, compareFn) {
    var retValD = protractor.promise.defer();

    var colArP = element.all(by.repeater('rec in d.data').column(colModelText));
    var colArValsP = colArP.map(function (el) {
        return el.getText();
    });
    colArValsP.then(function (colArVals) {
        var retVal = compareFn(colArVals);
        if (!retVal) {
            console.log(colModelText + ' compareFn returning false. Column data:', colArVals);
        }
        retValD.fulfill(retVal);
    });

    return retValD.promise;
}

/**
 *
 * Usage:
 *    var waitFn = new waitForState('data', 'dataUpdated')
 *    browser.wait(waitFn, ms, errstring);
 *
 * Expects a div with id='stateDiv' that has attributes that hold state info.
 * (Just a helper function to make the tests cleaner)
 */
function WaitForState(objName, stateIsTrue) {
    return function () {
        browser.sleep(250); // wait a little to give Angular time to run a digest and set state.
        return element(by.id('stateDiv')).getAttribute(objName)
            .then(function (strObj) {
                var obj = JSON.parse(strObj);
                console.log('WaitForState: ', objName, stateIsTrue, obj[stateIsTrue]);
                return obj[stateIsTrue];
            });
    };
}


function testTable(expNumPosts, shouldTitle, colModelText, compareFn) {
    describe('multiPost data table', function () {


        // Wait til table is initialized with data
        var waitFn = new WaitForState('data', 'dataUpdated');
        browser.wait(waitFn, 5000, 'multiPost failed to load data properly');

        it('should have a ' + expNumPosts + '  lines', function () {
            expect(element.all(by.css('#postDataTable tbody tr')).count()).toBe(expNumPosts);

        });

        it(shouldTitle, function () {
            compareCol(colModelText, compareFn).then(function (retVal) {
                expect(retVal).toBe(true);
            });

        });
    });
}

function testChart(expNumPosts, sortFn) {
    describe('multiPost chart', function () {

        var expNumPosts = 10;

        // Wait til chart is initialized with data
        var waitFn = new WaitForState('chart', 'chartUpdated');
        browser.wait(waitFn, 5000, 'multiPost failed to load chart properly');

        it('should have a ' + expNumPosts + '  lines', function () {
            expect(element.all(by.css('.nv-group')).count()).toBe(2 * expNumPosts);  // one for stroke, one for fill
        });


    });
}

describe('hind-cite multiPost', function () {
    var waitFn = new WaitForState('data', 'dataUpdated');

    describe('key elements', function () {
        browser.get('/multiPost');

        n.testNavbar();

        it('should have a post selector section', function () {
            expect(element(by.id('postsSelectors')).isPresent()).toBe(true);
        });

        it('should a chart control section', function () {
            expect(element(by.id('chartControls')).isPresent()).toBe(true);
        });

        it('should have a Post Data Table ', function () {
            expect(element(by.id('postDataTable')).isPresent()).toBe(true);
        });

        it('should have a postChart', function () {
            expect(element(by.id('postsChart')).isPresent()).toBe(true);
        });

    });

    describe('latest', function () {
        browser.get('/multiPost');
        var options = element.all(by.tagName('option'));
        options.each(function (elm, idx) {
            elm.getAttribute('value').then(function (text) {
                if (text === '["top","all"]') {
                    console.log('found HN Front Page - clicking');
                    elm.click();
                }

            });
        });


        testTable(10, 'lastRank should be ordered 1 to 10', 'stats.lastRank', function (inAr) {
            return _und.isEqual(inAr, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        });
        testChart(10, null);
    });

    describe('most points', function () {
        browser.get('/multiPost');

        var options = element.all(by.tagName('option'));
        options.each(function (elm, idx) {
            elm.getAttribute('value').then(function (text) {
                if (text === '["points","all"]') {
                    console.log('found points all - clicking');
                    elm.click();
                }

            });
        });

        testTable(10, 'most points should have decreasing points', 'stats.maxPoints', function (inAr) {
            // each val should be <= previous (note - inAr are strings, eg: '1,323'
            var retVal = true,
                lastVal = Number(inAr[0].replace(/,/g, '')),
                val;
            inAr.forEach(function (str) {
                val = Number(str.replace(/,/g, ''));
                retVal = retVal && val <= lastVal;
            });
            return retVal;
        });
        testChart(10, null);
    });
});






xdescribe('hind-cite multiPost', function () {
    var waitFn = new WaitForState('data', 'dataUpdated');

        browser.get('/multiPost');

        n.testNavbar();

        it('should have a post selector section', function () {
            expect(element(by.id('postsSelectors')).isPresent()).toBe(true);
        });

        it('should a chart control section', function () {
            expect(element(by.id('chartControls')).isPresent()).toBe(true);
        });

        it('should have a Post Data Table ', function () {
            expect(element(by.id('postDataTable')).isPresent()).toBe(true);
        });

        it('should have a postChart', function () {
            expect(element(by.id('postsChart')).isPresent()).toBe(true);
        });


        browser.get('/multiPost');
        var options = element.all(by.tagName('option'));
        options.each(function (elm, idx) {
            elm.getAttribute('value').then(function (text) {
                if (text === '["top","all"]') {
                    console.log('found HN Front Page - clicking');
                    elm.click();
                }

            });
        });
        browser.wait(waitFn, 5000, 'multiPost failed to load data properly');


        testTable(10, 'lastRank should be ordered 1 to 10', 'stats.lastRank', function (inAr) {
            return _und.isEqual(inAr, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        });
        testChart(10, null);

        browser.get('/multiPost');

        var options = element.all(by.tagName('option'));
        options.each(function (elm, idx) {
            elm.getAttribute('value').then(function (text) {
                if (text === '["points","all"]') {
                    console.log('found points all - clicking');
                    elm.click();
                }

            });
        });

        browser.wait(waitFn, 5000, 'multiPost failed to load data properly');

        testTable(10, 'most points should have decreasing points', 'stats.maxPoints', function (inAr) {
            // each val should be <= previous (note - inAr are strings, eg: '1,323'
            var retVal = true,
                lastVal = Number(inAr[0].replace(/,/g, '')),
                val;
            inAr.forEach(function (str) {
                val = Number(str.replace(/,/g, ''));
                retVal = retVal && val <= lastVal;
            });
            return retVal;
        });
        testChart(10, null);
});