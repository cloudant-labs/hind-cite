'use strict';
/* global d3:false, _:false, nv:false*/
/* exported chartSnapsPerDay */

var chartSnapsPerDay = (function ($, _, nv) {
    function chart() {
        var elId, chartSize, data;

        function init(config) {
            if (!config || !config.elId) {
                throw new Error('snapsPerDay.init - missing config properties: ', config);
            }

            elId = config.elId;
            chartSize = config.chartSize;
            data = config.data;

            d3.select(idToSelector(elId, 'chart'))
                .append('svg');
        }

        /**
         *
         * @param data -
         *  [
         ...
         history :
         [
         {
           "points": 6,
           "rank": 7,
           "comments": 0,
           "timestamp_str": "2014-02-24 14:42:36"
         },
         ...
         ]
         ]
         * @return [{x: 0, y: value}, ...]
         */
        function dataCloudantToNV(data) {
            var datal = [
                []
            ];
            var format = d3.time.format('%Y-%m-%d');

            data.forEach(function (d) {
                datal[0].push({x: format.parse(d.key), y: d.value});

            });

            var nvdata = [
                {key: 'Snaps Per Day', values: datal[0]}
            ];

            console.log('dataCloudantToNV. ', data, '-->', nvdata);
            return nvdata;
        }

        function idToSelector(id, subSelector) {
            if (!_.contains(['chart', 'svg'], subSelector)) {
                throw new Error('idToSelector - unexpected element name: ', subSelector);
            }

            var sel = '#' + id;

            if (subSelector === 'svg') {
                sel += ' svg';
            } else if (subSelector === 'chart') {
                sel += ' .chart';
            }

            return sel;
        }

        function draw(config) {

            if (!config || !config.data) {
                throw new Error('snapsPerDay.draw - missing config.data: ', config);
            }

            var postData = dataCloudantToNV(config.data);

            nv.addGraph(function () {
                var chart = nv.models.multiBarChart()
                        .x(function (d) {
                            return d.x;
                        })
                        .y(function (d) {
                            return d.y;
                        })
                        .tooltips(true)
                        .reduceXTicks(true)
                        .transitionDuration(350)
                        .showControls(false)
                        .showLegend(false)
                        .delay(0)
                    ;


                chart.xAxis
                    .tickFormat(function (d) {
                        return d3.time.format('%x')(d);
                    })
                    .axisLabel('Date (UTC)');

                chart.yAxis
                    .tickFormat(d3.format(',g'))
                    .axisLabel('Number');


                d3.select(idToSelector(elId, 'svg'))
                    .datum(postData)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });


        }

        return {
            init: init,
            draw: draw
        };
    }


    return {
        chart: chart
    };

}($, _, nv));

