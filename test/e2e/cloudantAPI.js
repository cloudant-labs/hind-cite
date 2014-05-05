'use strict';


describe('hind-cite cloudantAPI link on navbar', function () {


    it('navigate from / to cloudants api page', function () {
        browser.get('/');
        element(by.linkText('Cloudant API')).click();
        browser.driver.getCurrentUrl(function(url){
            expect(url.split('/')[1]).toBe('cloudant.com');
        });
    });
});


