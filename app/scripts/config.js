'use strict';

var config = (function () {

    var standard_chart_margin  =  {
        top: 20,
        right: 15,
        bottom: 30,
        left: 55
    };

    // Note - You have to change all the values in this object to be consistent
    var medChartSize = {
        margin: standard_chart_margin,

        svg_width: 700 ,
        width: 700  - standard_chart_margin.left - standard_chart_margin.right ,

        svg_height: 400,
        height: 400 - standard_chart_margin.top - standard_chart_margin.bottom
    };


    return {
        COUCH_SERVER : 'cs.cloudant.com',
        COUCH_DB : 'news',
        COUCH_DESIGN : 'by',
        VIEW_SNAPSPERDAY : 'snaps-per-day',
        VIEW_ID : 'id',

        medChartSize: medChartSize


    };

}());