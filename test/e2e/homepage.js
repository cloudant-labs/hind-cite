'use strict';

var n=require('./helpers/navbar.js');

describe('hind-cite homepage', function () {

    beforeEach(function(){
        browser.get('/');
    });

    n.testNavbar();

    it('should display a jumbotron', function () {
        expect(element(by.css('.jumbotron')).isPresent()).toBe(true);
    });
});


