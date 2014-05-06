'use strict';

var n = require('./helpers/navbar.js');


describe('hind-cite snapsPerDay', function () {
    describe('key elements', function () {
        beforeEach(function () {
            browser.get('/snapsPerDay');
        });

        n.testNavbar();

        it('should display a heading', function () {
            expect(element(by.tagName('h1')).isPresent()).toBe(true);
        });

        it('should display some body text', function () {
            expect(element(by.tagName('p')).isPresent()).toBe(true);
        });

        it('should display a chart (svg)', function () {
            expect(element(by.tagName('svg')).isPresent()).toBe(true);
        });
    });


    describe('snapsPerDay chart', function () {
        beforeEach(function () {
            browser.get('/snapsPerDay');

            // Wait til chart is initialized with data
            browser.wait(function () {
                return element(by.css('svg rect.nv-bar')).isPresent();
            }, 5000, 'snapsPerDay failed to load chart properly');
        });


        it('should have a lot of bars', function () {
            expect(element.all(by.css('svg rect.nv-bar')).count()).toBeGreaterThan(90);
        });

        it('should have an y-axis', function () {
            expect(element(by.css('svg .nv-y.nv-axis')).isPresent()).toBe(true);
        });

        it('should have an x-axis', function () {
            expect(element(by.css('svg .nv-x.nv-axis')).isPresent()).toBe(true);
        });
    });

});



