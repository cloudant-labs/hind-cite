/* global console:false, $:false, _:false, config:false */
/* jshint camelcase:false */  // camel: created_d is used elsewhere
/* exported getData*/

// require config.js, jquery

//noinspection JSHint
var getData = (function ($, _, config) {
    'use strict';
    /**
     * Given an object, return a query string expected by couch
     * @param params Object with parameters
     * @return {string} Query string with strings in quotess
     * @example
     *    {startkey: "2014-01-01", limit:10} ==> 'startkey="2014-01-01"&limit=10'
     */
    function paramsToQuery(params) {
        if (typeof(params) !== 'object') {
            throw new TypeError('Expected object as input. Got: ' + typeof(params) + JSON.stringify(params));
        }

        var outList = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                if (typeof(params[key]) === 'string') {
                    outList.push([key, '"' + params[key] + '"']);
                } else {
                    outList.push([key, params[key]]);
                }
            }
        }
        return outList.map(function (rec) {
            return rec[0] + '=' + rec[1];
        }).join('&');
    }

    function createUrl(viewName, params) {
        var url = _.template('https://<%= baseUrl %>/<%= db %>/_design/<%= designDoc %>/_view/<%= viewName %>',
            {
                baseUrl: config.COUCH_SERVER,
                db: config.COUCH_DB,
                designDoc: config.COUCH_DESIGN,
                viewName: viewName
            });

        if (params) {
            url += '?' + paramsToQuery(params);
        }
        return url;
    }

    function createSnapsUrl(params) {
        return createUrl(config.VIEW_SNAPSPERDAY, params);
    }

    function createIdUrl(params) {
        return createUrl(config.VIEW_ID, params);
    }

    function createLatestUrl(params) {
        return createUrl(config.VIEW_LATEST, params);
    }

    /**
     *
     * @param successFn
     *   - data - reformated data
     *   - context = ajax config data
     */
    function get(url, successFn, errFn) {
        if (!errFn) {
            errFn = function (jqXHR, textStatus, errorThrown) {
                console.log('Error getting url:', url, textStatus, errorThrown);
            };
        }

        if (!successFn) {
            throw new Error('get called without success function');
        }

        function callSuccessFn(rawData) {
            console.log('Got data: ', rawData);
            successFn(rawData, this);
        }

        var config = {
            url: url,
            dataType: 'json',
            crossDomain: true,
            error: errFn,
            success: callSuccessFn
        };

        console.log('Getting data:\n$.ajax('+ JSON.stringify(config, null, 4)+');');
        $.ajax(config);
    }


    function getSnapshots(params, successFn, errFn) {
        var url = createSnapsUrl(params);
        get(url, successFn, errFn);
    }

    /**
     * Sets the created_d and timestamp_d fields for the whole record, and for each history record.
     * @param rec - a HNPost record
     * @returns - updates record IN PLACE
     */
    function setTimestamps(rec) {
        rec.created_d = rec.created && hnutils.hnDateStrToDate(rec.created);

        if (rec.history) {
            rec.history.forEach(function (d) {
                d.created_d = d.created && hnutils.hnDateStrToDate(d.created);
                d.timestamp_d = d.timestamp_str && hnutils.hnDateStrToDate(d.timestamp_str);
            });
        }
    }

    /**
     * Supplment a set of data records with stats
     * @param data
     */
    function addStats(data) {
        data.forEach(function(rec){
            rec.stats=hnutils.createStats(rec);
        });
    }



    function reformatMultIdData(raw) {
        var out=[];
        raw.rows.forEach(function(rec) {
            out.push(rec.value);
            setTimestamps(out[out.length-1]);
        });
        addStats(out);

        return out;
    }


    //noinspection JSUnusedLocalSymbols,JSHint
    /**
     * @param ids - this is the key. eg: ['6712703', '7473752']
     * @param otherParams - other params to send (though not sure they are needed)
     * @param successFn - fn(data, context)
     *      - data - reformated data
     *      - context = ajax config data
     */

    function getMultIds(ids, otherParams, successFn, errFn) {
        if (!ids) {
            throw new Error('getById: improper parameters. No id propery');
        }
        var url = createIdUrl(otherParams);
        var payload=JSON.stringify({keys: ids});

        function callSuccessFn(rawData) {
            console.log('Got data: ', rawData);

            var modData = reformatMultIdData(rawData);
            modData = filterBadIds(modData);
            successFn(modData, this);
        }

        var config={
            url: url,
            dataType: 'json',
            crossDomain: true,
            type: 'POST',  // For sending multiple ids
            error: errFn,
            success: callSuccessFn,
            data: payload
        };

        console.log('Getting data:\n$.ajax('+ JSON.stringify(config, null, 4)+');');
        $.ajax(config);

    }

    function reformatLatest(raw) {
        var out = [], curRec;

        raw.rows.forEach(function (row) {
            curRec = row.value.doc;
            setTimestamps(curRec);
            out.push(curRec);
        });
        addStats(out);
        return out;
    }


    /**
     * Returns (in successFn) a list of documents - the last top N posts
     * @param limit
     */
    function getLatest(limit, otherParams, successFn, errFn) {
        if (limit === null) {
            throw new Error('getLatest: improper parameters. topN not set properly');
        }
        var params = {} || otherParams;
        params.reduce = true;
        params.group = true;
        params.group_level = 1;
        params.limit = limit;

        var url = createLatestUrl(params);
        get(url, function (rawData, context) {
            var modData = reformatLatest(rawData);
            modData = filterBadIds(modData);
            successFn(modData, context);
        }, errFn);
    }

    /**
     * val - a number or string
     * returns - number or string surrounded with quotes. ("input string")
     */
    function numbOrQuotedString(val) {
        if (typeof(val) === 'number') {
            return val;
        } else if (typeof(val) === 'string') {
            return '"' + val + '"';
        } else {
            throw new Error('Unexpected type: typeof(val)' + typeof(val) + 'val: '+ val);
        }
    }

    /**
     * This is not a perfectly complete URL creator.
     * @param query eg: {points: 100, comments: [50,Infinity], created:['2014-03-01', '9999'] }
     *  ==> ?q=points:100 AND comments: [50, Infinity] AND created: ['2014-03-01', '9999']
     *
     */
    function createSearchUrl(searchName, query, params) {
        if (Object.keys(query).length === 0) {
            throw new Error('createSearchUrl - cant have empty query');
        }

        var url = _.template('https://<%= baseUrl %>/<%= db %>/_design/<%= designDoc %>/_search/<%= searchName %>?q=',
            {
                baseUrl: config.COUCH_SERVER,
                db: config.COUCH_DB,
                designDoc: config.COUCH_DESIGN,
                searchName: searchName
            });

        var queryArray = [];
        for (var key in query) {
            //noinspection JSUnfilteredForInLoop
            if (query[key] instanceof(Array)) {
                //noinspection JSUnfilteredForInLoop
                queryArray.push(_.template('<%= key %>:[<%= from %> TO <%= to %>]',
                    {key: key, from: numbOrQuotedString(query[key][0]), to: numbOrQuotedString(query[key][1])}));
            } else {
                //noinspection JSUnfilteredForInLoop
                queryArray.push(_.template('<%= key %>:<%= val %>',
                    {key: key, val: query[key]}));
            }
        }
        url += queryArray.join(' AND ');

        params = params || {};
        params.limit = params.limit || 20;  // default limit, just in case
        url += '&' + paramsToQuery(params);

        return url;
    }

    function reformatSearch(rawData) {
        var out=  rawData.rows.map(function (row) {
            var rec = row.doc;
            setTimestamps(rec);
            return rec;
        });
        addStats(out);
        return out;
    }

    /**
     * Most records have id format == 9999999 (7)
     * Some job records also have that id (if we can find it during scraping)
     * Some job records do NOT have that format and instead have format: "JOB: <url><title>"
     * These records aren't very important, aren't very common, and cause problems (in ui, in urls, in parsing id lists, etc.)
     * Removing them here seems the best option (as opposed to removing the data at the scraper, which is irrevocable)
     * @param data - [rec,rec,...,rec]
     */
    function filterBadIds(data) {
        var out=[];
        data.forEach(function(rec){
            if (/^[0-9]{7}$/.test(rec.id)) {
                out.push(rec);
            }
        });
        return out;
    }

    /**
     * query: {key : val}
     * keys:
     *      createed/lastTimestamp: null, 2014* or ["2014-01-01 00:00:00", "9999"]
     *      points, comments, highestrank: null, Number, or range: [100, Infinity]
     * limit - number of records to be returned;
     * otherParams.sort - eg: "-points"
     * All queries will be ANDed together
     */
    function getSearch(query, limit, otherParams, successFn, errFn) {
        if (!otherParams || !otherParams.sort) {
            throw new Error('getSearch requires otherParams.sort');
        }
        var params = otherParams || {};
        params.include_docs = true;
        params.limit = limit || 30;

        var url = createSearchUrl(config.SEARCH_POSTS, query, params);
        get(url, function (rawData, context) {
            var modData = reformatSearch(rawData);
            modData = filterBadIds(modData);
            successFn(modData, context);
        }, errFn);
    }

    function getByPoints(dateRange, limit, otherParams, successFn, errFn) {
        var modParams = otherParams || {};
        modParams.sort = '-points';
        var query = {points: [0, Infinity]};
        if (dateRange) {
            query.created = dateRange;
        }
        getSearch(query, limit, modParams, successFn, errFn);
    }

    function getByComments(dateRange, limit, otherParams, successFn, errFn) {
        var modParams = otherParams || {};
        modParams.sort = '-comments';
        var query = {comments: [0, Infinity]};
        if (dateRange) {
            query.created = dateRange;
        }
        getSearch(query, limit, modParams, successFn, errFn);
    }

    return {
        paramsToQuery: paramsToQuery,
        createUrl: createUrl,
        createSnapsUrl: createSnapsUrl,
        createIdUrl: createIdUrl,
        get: get,
        getSnapshots: getSnapshots,
        createLatestUrl: createLatestUrl,
        getLatest: getLatest,
        reformatLatest: reformatLatest,
        getMultIds: getMultIds,
        createSearchUrl: createSearchUrl,
        getSearch: getSearch,
        getByPoints: getByPoints,
        getByComments: getByComments
    };

}($, _, config));