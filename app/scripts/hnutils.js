/* exported hnutils */
/* global _:false */

var hnutils = (function (_) {
    'use strict';

    function dateStrToDate(hnDateStr) {
        // "2014-04-04 08:13:53" --> Date
        var parsed = hnDateStr.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2}) ([0-9]{2}:[0-9]{2}:[0-9]{2})$/);
        if (!parsed || parsed.length !== 3) {
            throw new Error('Improper datestr format: ', hnDateStr);
        }

        return new Date(parsed[1] + 'T' + parsed[2] + 'Z');
    }

    function createStats(hnRec) {
        if (!hnRec.history) {
            return {};
        }

        var o = {
                exposure: 0,
                minRank: Infinity,
                secTop30: 0,
                secTop60: 0
            },
            l = hnRec.history.length - 1,
            firstSnap = +hnRec.history[0].timestamp_d,
            lastSnap = firstSnap,
            top = {10: [], 30: [], 60: []},
            inside = {10: false, 30: false, 60: false};


        o.lastRank = hnRec.history[l].rank;
        o.maxPoints = hnRec.history[l].points;
        o.maxComments = hnRec.history[l].comments;

        hnRec.history.forEach(function (snap) {
            o.minRank = Math.min(o.minRank, snap.rank);
            o.exposure += (60 - snap.rank) * (snap.timestamp_d - lastSnap)/1000;

            for (var key in top) {
                if (snap.rank <= Number(key)) {
                    if (snap.timestamp_d === firstSnap || !inside[key]) {
                        top[key].push([snap.timestamp_d, snap.timestamp_d]);
                    } else {
                        top[key][top[key].length - 1][1] = snap.timestamp_d;
                    }
                    inside[key] = true;
                } else {
                    inside[key] = false;
                }
            }
            lastSnap = snap.timestamp_d;
        });

        for (var key in top) {
            o['secTop' + key] = top[key].reduce(function (prev, cur) {
                return prev + (cur[1] - cur[0]) / 1000;
            }, 0);
        }

        return o;

    }

    return {
        hnDateStrToDate: dateStrToDate,
        createStats: createStats
    };

}(_));