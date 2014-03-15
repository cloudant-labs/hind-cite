'use strict';


var testParams={group:true, startkey:'2014-03-01', limit:2},
    viewResults={"rows":[
        {"key":"2014-03-01","value":17160},
        {"key":"2014-03-02","value":17220}
    ]};

describe('getData Formatting', function () {

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

var getByIdData={"total_rows":5982,"offset":4460,"rows":[
    {"id":"188868225c5f967d67a4526e6c408d58","key":"6712703","value":{"_id":"188868225c5f967d67a4526e6c408d58","_rev":"1-c5dac11a64ad4a7206d70147283782d7","doc_type":"post","domain":"sarahmei.com","author":"hyperpape","title":"Why You Should Never Use MongoDB","created":"2013-11-11 19:36:22","href":"http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/","id":"6712703","history":[{"domain":"sarahmei.com","author":"hyperpape","title":"Why You Should Never Use MongoDB","created":"2013-11-11 19:36:22","points":529,"rank":53,"href":"http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/","comments":337,"id":"6712703","timestamp_str":"2014-03-12 19:36:22"}]}}
]};
var getById_id='6712703';


describe('getById works', function(){
    var retVal, done;

    beforeEach(function(){
        retVal={};
        done=false;
    });


    it('returns proper data', function(){
        runs(function() {
            getData.getById(getById_id, {}, function(data){
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
            expect(retVal.rows).toEqual(getByIdData.rows);
        });

    });

});