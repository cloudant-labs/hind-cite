'use strict';


var chartMultiPost = (function ($, _, nv) {
    function chart() {
        var elId, chartSize, data, graph, nvChart;

        function init(config) {
            if (!config || !config.elId) {
                throw new Error('snapsPerDay.init - missing config properties: ', config);
            }

            elId = config.elId;
            chartSize = config.chartSize;
            data = config.data;

            d3.select(idToSelector(elId, 'chart'))
                .append("svg")


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
                [],
                [],
                []
            ];
            data.history.forEach(function (d, i) {
                datal[0].push({x: d.timestamp_d, y: d.rank})  // TODO- handle missing data?
                datal[1].push({x: d.timestamp_d, y: d.points})
                datal[2].push({x: d.timestamp_d, y: d.comments})
            });

            var nvdata = [
                {key: "Rank", values: datal[0]},
                {key: "Points", values: datal[1]},
                {key: "Comments", values: datal[2]}
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
            } else if (subSelector == 'chart') {
                sel += ' .chart';
            }

            return sel;
        }

        /**
         * Modifies postData in place.
         */
        function postDataToNVD3Series(postData) {

            postData[0].type = 'line';
            postData[0].yAxis = 1;
            postData[1].type = 'line';
            postData[1].yAxis = 2;
            postData[2].type = 'line';
            postData[2].yAxis = 2;

        }

        function draw(config) {

            if (!config || !config.data) {
                throw new Error('snapsPerDay.draw - missing config.data: ', config);
            }

            var postData = dataCloudantToNV(config.data);
            postDataToNVD3Series(postData);

            nv.addGraph(function () {
                nvChart = nv.models.multiChart()
                    .margin({top: 30, right: 50, bottom: 50, left: 50})


                nvChart.xAxis
                    .axisLabel('Time (local TZ)')
                    .tickFormat(function (d, i) {
                        return d3.time.format('%_m/%_d/%y %H:%M')(new Date(d));
                    });


                nvChart.yDomain1([60, 1])
                nvChart.yAxis1
                    .axisLabel('Rank')
                    .axisLabelDistance(50)
                    .tickFormat(d3.format('d'));

                // TODO: It would be nice to set the y-axis to always have 0 as the min. This works, but it sets the max value to the max of both series, instead of adapting when legend changes.

                nvChart.yAxis2
                    .axisLabel('Number')
                    .axisLabelDistance(50)
                    .tickFormat(d3.format(',g'))


                d3.select(idToSelector(elId, 'svg'))
                    .datum(postData)
                    .call(nvChart);

                nv.utils.windowResize(function () {
                    nvChart.update()
                });
                return nvChart;
            });

        }


        return {
            init: init,
            draw: draw
        }
    }


    return {
        chart: chart
    };

}($, _, nv));

