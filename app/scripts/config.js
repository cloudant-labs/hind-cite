'use strict';
/* jshint unused:false*/

var config = (function () {

    var standardChartMargin  =  {
        top: 20,
        right: 15,
        bottom: 30,
        left: 55
    };

    // Note - You have to change all the values in this object to be consistent
    var medChartSize = {
        margin: standardChartMargin,

        svgWidth: 700 ,
        width: 700  - standardChartMargin.left - standardChartMargin.right ,

        svgHeight: 400,
        height: 400 - standardChartMargin.top - standardChartMargin.bottom
    };


    return {
        COUCH_SERVER : 'cs.cloudant.com',
        COUCH_DB : 'news',
        COUCH_DESIGN : 'by',
        VIEW_SNAPSPERDAY : 'snaps-per-day',
        VIEW_ID : 'id',
        VIEW_LATEST : 'latest',
        SEARCH_POSTS : 'posts',

        // Google Analytics
        GA_DEV : {
            domain: '<anything>',
            code: 'UA-4174464-6'
        },
        GA_STAGE: {
            domain: 'hnstage.k2company.com',
            code: 'UA-4174464-6'
        },
        GA_PROD: {
            domain: 'www.hind-cite.com',
            code: 'UA-4174464-6'
        },

        medChartSize: medChartSize


    };

}());