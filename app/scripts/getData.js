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
            throw new TypeError('Expected object as input. Got: ' + typeof(params));
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
        rec.created_d = rec.created &&  _.hnDateStrToDate(rec.created);

        if (rec.history) {
            rec.history.forEach(function (d) {
                d.created_d = d.created && _.hnDateStrToDate(d.created);
                d.timestamp_d = d.timestamp_str &&  _.hnDateStrToDate(d.timestamp_str);
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
     * @param topN
     */
    function getLatest(topN, otherParams, successFn, errFn) {
        if (topN === null) {
            throw new Error('getLatest: improper parameters. topN not set properly');
        }
        var params = {} || otherParams;
        params.reduce = true;
        params.group = true;
        params.group_level = 1;
        params.limit = topN;

        var url = createLatestUrl(params);
        get(url, function (rawData) {
            var modData = reformatLatest(rawData);
            successFn(modData);
        }, errFn);
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
        getMultIds: getMultIds
    };

}($, _, config));