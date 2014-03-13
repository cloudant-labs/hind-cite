'use strict';


var testParams={group:true, startkey:'2014-03-01', limit:2},
    viewResults={"rows":[
        {"key":"2014-03-01","value":17160},
        {"key":"2014-03-02","value":17220}
    ]};

xdescribe('getData Formatting', function () {

    it('paramsToQuery: should return a properly formatted query string for couch', function () {
        expect(getData.paramsToQuery(testParams)).toBe('group=true&startkey="2014-03-01"&limit=2');
        expect(function() {getData.paramsToQuery('String')}).toThrow();
    });

    it('createSnapsUrl: should create proper snapshot view url', function(){
        expect(getData.createSnapsUrl(testParams)).toBe(
            'https://cs.cloudant.com/news/_design/by/_view/snaps-per-day?group=true&startkey="2014-03-01"&limit=2' );
    });


});



describe('getData return values are correct', function(){
    var retVal, done;

    beforeEach(function(){
        retVal={};
        done=false;
    });


    it('getSnapshots should return proper data', function(){
        runs(function() {
            getData.getSnapshots(testParams, function(data){
                retVal=data;
                done=true;
            }, function(){
                retVal='ERROR';
                done=true;
            })
        });


        waitsFor(function() {
            return done;
        }, 'timed out', 1000);

        runs(function(){
            expect(retVal).toEqual(viewResults);
        });

    });

});