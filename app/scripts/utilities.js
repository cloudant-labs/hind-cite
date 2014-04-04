'use strict';
/*global _:false*/

// Extend _ with helpful functions
_.mixin({
    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    },
    toTitleCase: function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    hnDateStrToDate : function(hnDateStr) {
        // "2014-04-04 08:13:53" --> Date
        var parsed = hnDateStr.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2}) ([0-9]{2}:[0-9]{2}:[0-9]{2})$/);
        if (! parsed || parsed.length !== 3){
            throw new Error('Improper datestr format: ', hnDateStr);
        }

        return new Date(parsed[1]+'T'+parsed[2]+'Z');
    }
});