'use strict';
/* global console:false, $:false, _:false, config:false */
/* jshint camelcase:false */  // camel: created_d is used elsewhere
/* exported getData*/

// require config.js, jquery

//noinspection JSHint
var getData = (function ($, _, config) {

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

    function get(url, successFn, errFn) {
        if (!errFn) {
            errFn = function (jqXHR, textStatus, errorThrown) {
                console.log('Error getting url:', url, textStatus, errorThrown);
            };
        }

        if (!successFn) {
            throw new Error('get called without success function');
        }

        $.ajax({
            url: url,
            dataType: 'jsonp',
            error: errFn,
            success: successFn
        });
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
        rec.created_d = rec.created && _.hnDateStrToDate(rec.created);

        if (rec.history) {
            rec.history.forEach(function (d) {
                d.created_d = d.created && _.hnDateStrToDate(d.created);
                d.timestamp_d = d.timestamp_str && _.hnDateStrToDate(d.timestamp_str);
            });
        }
    }

    /**
     *
     * @param raw - raw data from cloudant
     * @returns Just the relevant data, with created_d, and timestamp_d --> localized date objects.
     */
    function reformatByIdData(raw) {
        var rec = raw.rows[0].value;

        setTimestamps(rec);
        return rec;
    }

    /**
     *
     * @param id - this is the key. eg: '6712703'
     * @param otherParams - other params to send (though not sure they are needed)
     */
    function getById(id, otherParams, successFn, errFn) {
        if (!id) {
            throw new Error('getById: improper parameters. No id propery');
        }
        var params = {} || otherParams;
        params.key = id;

        var url = createIdUrl(params);
        get(url, function (rawData) {
            if (rawData.rows.length === 0) {
                return;  //don't do successFn.
            }
            var modData = reformatByIdData(rawData);
            successFn(modData);
        }, errFn);
    }


    //noinspection JSUnusedLocalSymbols,JSHint
    /**
     *
     * @param ids - this is the key. eg: '6712703'
     * @param otherParams - other params to send (though not sure they are needed)
     */
    function getMultIds(ids, otherParams, successFn, errFn) {
        if (!ids) {
            throw new Error('getById: improper parameters. No id propery');
        }
        var returnedData = [], timeoutID = null;

        function callSuccessFn() {
            successFn(returnedData);
        }

        timeoutID = setTimeout(function () {
            callSuccessFn();
        }, 5000);


        ids.forEach(function (id) {
            getById(id, otherParams, function (data) {
                returnedData.push(data);
                if (returnedData.length === ids.length) {
                    clearTimeout(timeoutID);
                    callSuccessFn();
                }
            });
        });
    }

    function reformatLatest(raw) {
        var out = [], curRec;

        raw.rows.forEach(function (row) {
            curRec = row.value.doc;
            setTimestamps(curRec);
            out.push(curRec);
        });
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
        get(url, function (rawData) {
            var modData = reformatLatest(rawData);
            successFn(modData);
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
        return rawData.rows.map(function (row) {
            var rec = row.doc;
            setTimestamps(rec);
            return rec;
        });

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
        get(url, function (rawData) {
            var modData = reformatSearch(rawData);
            successFn(modData);
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
        getById: getById,
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