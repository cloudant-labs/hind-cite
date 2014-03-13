'use strict';

// require config.js, jquery

var getData = (function ($, _, config) {

    /**
     * Given an object, return a query string expected by couch
     * @param params Object with parameters
     * @return {string} Query string with strings in quotess
     * @example
     *    {startkey: "2014-01-01", limit:10} ==> 'startkey="2014-01-01"&limit=10'
     */
    function paramsToQuery(params){
        if (typeof(params) !== 'object') {
            throw new TypeError('Expected object as input. Got: '+typeof(params));
        }

        var outList = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)){
                if (typeof(params[key])==='string') {
                    outList.push([key, '"'+params[key]+'"']);
                } else {
                    outList.push([key, params[key]]);
                }
            }
        }
        return outList.map(function(rec){return rec[0]+'='+rec[1]}).join('&');
    }

    function createUrl(viewName, params) {
        var url= _.template('https://<%= baseUrl %>/<%= db %>/_design/<%= designDoc %>/_view/<%= viewName %>',
            {
                baseUrl : config.COUCH_SERVER,
                db : config.COUCH_DB,
                designDoc : config.COUCH_DESIGN,
                viewName : viewName
            });

        if (params){
            url += '?'+paramsToQuery(params);
        }
        return url;
    }

    function createSnapsUrl(params) {
        return createUrl(config.VIEW_SNAPSPERDAY, params);
    }

    function get(url, successFn, errFn) {
        if (! errFn){
            errFn = function(jqXHR, textStatus, errorThrown) {
                console.log('Error getting url:', url, textStatus, errorThrown);
            }
        }

        if (! successFn) {
            throw new Error('get called without success function');
        }

        $.ajax({
            url: url,
            dataType: 'jsonp',
            error: errFn,
            success: successFn
        })
    }

    function getSnapshots(params, successFn, errFn){
        var url=createSnapsUrl(params);
        get(url, successFn, errFn);
    }

    function test() {
        var params={group:true, startkey:'"2014-02-07"', endkey:'"2014-02-08"'};
        var url='https://cs.cloudant.com/news/_design/by/_view/snaps-per-day'+'?'+$.param(params);

        $.ajax({
            url: url,
            dataType: 'jsonp',
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Error:',textStatus, errorThrown)
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Success:', data);
            }
        })
    }

    return {
        test : test,
        paramsToQuery : paramsToQuery,
        createUrl : createUrl,
        createSnapsUrl : createSnapsUrl,
        get : get,
        getSnapshots : getSnapshots
    };

}($, _, config));