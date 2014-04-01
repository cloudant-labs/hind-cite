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

var getByIdData={ id : '188868225c5f967d67a4526e6c408d58', key : '6712703', value : { _id : '188868225c5f967d67a4526e6c408d58', _rev : '1-c5dac11a64ad4a7206d70147283782d7', doc_type : 'post', domain : 'sarahmei.com', author : 'hyperpape', title : 'Why You Should Never Use MongoDB', created : '2013-11-11 19:36:22', href : 'http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/', id : '6712703', history : [ { domain : 'sarahmei.com', author : 'hyperpape', title : 'Why You Should Never Use MongoDB', created : '2013-11-11 19:36:22', points : 529, rank : 53, href : 'http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/', comments : 337, id : '6712703', timestamp_str : '2014-03-12 19:36:22' } ] } };

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

describe('getLatest works', function(){
    var retVal, done;

    beforeEach(function(){
        retVal={};
        done=false;
    });


    it('returns proper data', function(){
        runs(function() {
            getData.getLatest(5, {}, function(data){
                retVal=data;
                console.log('MANUAL: Compare the following list with HackerNews Page 1 (should be similar)');
                console.log('rank\t\ttitle');
                console.log('====\t\t==============');
                retVal.forEach(function(rec, i){
                   console.log("    ".substring(0, 4 - (String(i).length))+i+'\t\t'+rec.title);
                });
                done=true;
            }, function(){
                retVal='ERROR';
                done=true;
            })
        });


        waitsFor(function() {
            return done;
        }, 'timed out', 2500);

        runs(function(){
            expect(retVal.length).toEqual(5);
            expect(retVal[0].history).toBeDefined();
            expect(retVal[0].history[retVal[0].history.length-1].rank).toEqual(1);
            expect(retVal[4].history[retVal[4].history.length-1].rank).toEqual(5);
            expect(retVal[0].created_d).toBeDefined();
            expect(retVal[0].history[0].timestamp_d).toBeDefined();
            expect(retVal[0].history[0].created_d).toBeDefined();
        });

    });

});

describe('getMultIds works', function(){
    var retVal, done;

    beforeEach(function(){
        retVal={};
        done=false;
    });


    it('returns proper data', function(){
        runs(function() {
            getData.getMultIds(["7415660","7412612"], {}, function(data){
                retVal=data;
                done=true;
            }, function(){
                retVal='ERROR';
                done=true;
            })
        });


        waitsFor(function() {
            return done;
        }, 'timed out', 6000);

        runs(function(){
            expect(retVal.length).toBe(2);
        });

    });

});