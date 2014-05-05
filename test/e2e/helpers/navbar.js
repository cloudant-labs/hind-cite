/* exported testNavbar */

'use strict';

function testNavbar(){
    var expectedNavBar=['hind-cite', 'About', 'Cloudant API', 'Post History', 'SnapsPerDay'];

    it('should have the proper navbar', function () {
        var navItems = element.all(by.css('.navbar a'));

        var navTexts=navItems.map(function(elm){
            return elm.getText();
        });

        // The docs make it look like navTexts should be resolved, but its not! Its an unresolved promise.
        navTexts.then(function(val){
            expect(val).toEqual(expectedNavBar);
        });
    });
}

module.exports.testNavbar = testNavbar;