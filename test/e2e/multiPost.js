'use strict';

var n = require('./helpers/navbar.js');
var _und = require('../../app/bower_components/underscore/underscore.js');

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
            console.log('table (' + colModelText + ') compareFn returning false. Column data:', colArVals);
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
        return element(by.id('stateDiv')).getAttribute(objName)
            .then(function (strObj) {
                var obj = JSON.parse(strObj);
//                if (obj[stateIsTrue]) {
//                    console.log('WaitForState: ', objName, obj[stateIsTrue]);
//                }

                return obj[stateIsTrue];
            });
    };
}

function selectDropdown(dropdownValueStr) {
    var options = element.all(by.tagName('option'));
    options.each(function (elm) {
        elm.getAttribute('value').then(function (text) {
            if (text === dropdownValueStr) {
                //console.log('found ' + dropdownValueStr + ' - clicking');
                elm.click();
            }

        });
    });

    var waitDataFn = new WaitForState('data', 'dataUpdated');
    browser.wait(waitDataFn, 5000, 'data failed to load after clicking most points');
    var waitChartFn = new WaitForState('chart', 'chartUpdated');
    browser.wait(waitChartFn, 5000, 'data failed to load after clicking most points');


}


function testTable(expNumPosts, shouldTitle, colModelText, compareFn) {


    it('table should have ' + expNumPosts + '  row', function () {
        expect(element.all(by.css('#postDataTable tbody tr')).count()).toBe(expNumPosts);
    });

    it(shouldTitle, function () {
        compareCol(colModelText, compareFn).then(function (retVal) {
            expect(retVal).toBe(true);
        });

    });


}

function testChart(expNumPosts) {

    it('chart should have ' + expNumPosts + '  lines drawn', function () {
        expect(element.all(by.css('.nv-group')).count()).toBe(2 * expNumPosts);  // one for stroke, one for fill
    });

}

describe('hind-cite multiPost', function () {
    beforeEach(function () {
        browser.get('/multiPost');
    });

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
        beforeEach(function () {
            browser.get('/multiPost');
            selectDropdown('["top","all"]');
        });

        testTable(10, 'table (lastRank) should be ordered 1 to 10', 'stats.lastRank', function (inAr) {
            return _und.isEqual(inAr, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        });
        testChart(10, null);
    });

    describe('most points', function () {
        beforeEach(function () {
            browser.get('/multiPost');
            selectDropdown('["points","all"]');
        });

        testTable(10, 'table (most points) should have decreasing points', 'stats.maxPoints', function (inAr) {
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

    describe('most comments - 7 days ', function () {
        beforeEach(function () {
            browser.get('/multiPost');
            selectDropdown('["comments",7]');
        });

        testTable(10, 'table (most comments) should have decreasing comments', 'stats.maxComments', function (inAr) {
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

/**
 * Other e2e tests
 *    It would be nice to make these tests complete.
 *    My next one would have been testing Search functionality.
 *    Unfortunately, sendkeys() isn't working. I suspect it is typing the data too fast and
 *    the autofill functionality in the control is somehow capturing the keys. Regardless, when I do:
 *            element(by.css('#inputfield input')).sendKeys('Elon Musk: To the People of New Jersey')
 *    I only get a random amount of keystrokes properly entered.
 *    Enough with fighting webdriver! Some other day.
 *
 */