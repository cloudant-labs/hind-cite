/* global d3:false, _:false, nv:false*/
/* exported chartMultiPost */
/* jshint camelcase:false */

var chartMultiPost = (function ($, _, nv) {
    'use strict';

    function chart() {
        var elId,  data, nvChart;

        nv.dev = false;  // turn off nvd3 automatic console logging

        function init(config) {
            if (!config || !config.elId) {
                throw new Error('snapsPerDay.init - missing config properties: ', config);
            }

            elId = config.elId;
            data = config.data;

            d3.select(idToSelector(elId, 'chart'))
                .append('svg');


        }


        function dataCloudantToNV(raw, metric) {
            var rawSeries, outSeries, out = [];

            for (var key in raw) {
                if (key === 'timestamp') {
                    continue;
                }

                //noinspection JSUnfilteredForInLoop
                rawSeries = raw[key];
                outSeries = {
                    key: rawSeries.title, //.substring(0,10),
                    id: rawSeries.id,
                    title: rawSeries.title,
                    values: []
                };

                var t0 = rawSeries.history[0].timestamp_d.getTime();
                // TODO - Change this? JSHINT doesn't like it. Maybe it is bad form?
                rawSeries.history.forEach(function (snap) {
                    outSeries.values.push({x: (snap.timestamp_d.getTime() - t0) / (1000 * 60 * 60), y: snap[metric]}); // Time in hours since first snap
                });

                out.push(outSeries);
            }

            return out;
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

            if (!config || !config.data || !config.metric || !config.rankRange) {
                throw new Error('snapsPerDay.draw - missing config.data: ', config);
            }

            var postData = dataCloudantToNV(config.data, config.metric);

            nv.addGraph(function () {
                nvChart = nv.models.lineChart()
                    .margin({top: 30, right: 50, bottom: 50, left: 50})
                    .useInteractiveGuideline(true);

                nvChart.clamp(true);

                nvChart.legend.key(function (d) {
                    return d.key.substring(0, 10);
                });


                nvChart.xAxis
                    .axisLabel('Hours From First Post')
                    .tickFormat(d3.format('.0f'))
                    .tickValues(_.range(0, 2000, 6));

                nvChart.yAxis
                    .axisLabel(_.toTitleCase(config.metric))
                    .axisLabelDistance(50)
                    .tickFormat(d3.format('d'));

                if (config.metric === 'rank') {
                    nvChart.yDomain([config.rankRange, 1]);
                    nvChart.yAxis
                        .tickValues([1, 30, 60]);
                }


                d3.select(idToSelector(elId, 'svg'))
                    .datum(postData)
                    .call(nvChart);

                nv.utils.windowResize(function () {
                    nvChart.update();
                });

                return nvChart;
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

