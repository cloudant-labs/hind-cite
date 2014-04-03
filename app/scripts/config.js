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

        medChartSize: medChartSize


    };

}());