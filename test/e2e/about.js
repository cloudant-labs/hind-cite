'use strict';

var n=require('./helpers/navbar.js');

describe('hind-cite about page', function () {

    beforeEach(function(){
        browser.get('/about');
    });

    n.testNavbar();

    it('should should have a lot of <p> and <h2> tags', function () {
        expect(element.all(by.tagName('h2')).count()).toBeGreaterThan(5);
        expect(element.all(by.tagName('p')).count()).toBeGreaterThan(5);
    });
});


