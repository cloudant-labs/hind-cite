'use strict';


var chartPost = (function ($, _, nv) {
    function chart() {
        var elId, chartSize, data, graph;

        function init(config) {
            if (!config || !config.elId || !config.chartSize) {
                throw new Error('snapsPerDay.init - missing config properties: ', config);
            }

            elId = config.elId;
            chartSize = config.chartSize;
            data = config.data;

            d3.select(idToSelector(elId, 'chart'))
                .append("svg")
                .style('height', chartSize.svg_height)
                .style('width', chartSize.svg_width)


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
            var datal = [[],[],[]];
            data[0].value.history.forEach(function (d, i) {
                datal[0].push({x: new Date (Date.parse(d.timestamp_str)) , y: d.rank})
                datal[1].push({x: new Date (Date.parse(d.timestamp_str)) , y: d.points})
                datal[2].push({x: new Date (Date.parse(d.timestamp_str)) , y: d.comments})
            });

            var nvdata=[
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

            var sel='#'+id;

            if (subSelector==='svg') {
                sel += ' '+ subSelector;
            }

            return sel;
        }

        function draw(config) {

            if (!config || !config.data) {
                throw new Error('snapsPerDay.draw - missing config.data: ', config);
            }

            var postData = dataCloudantToNV(config.data);''

            postData[0].type='line';
            postData[0].yAxis=1;
            postData[1].type='line';
            postData[1].yAxis=2;
            postData[2].type='line';
            postData[2].yAxis=2;

            nv.addGraph(function () {
                var chart = nv.models.multiChart()
                     .margin({top: 30, right: 60, bottom: 50, left: 70})


                chart.xAxis     //Chart x-axis settings
                    .axisLabel('Time (UTC)')
                    .tickFormat(function(d) {
                        return d3.time.format('%_m/%_d/%y %H:%M')(new Date(d));
                    });


                chart.yDomain1([60,1])
                chart.yAxis1     //Chart y-axis settings
                    .axisLabel('Rank')
                    .tickFormat(d3.format('d'));

                // TODO: It would be nice to set the y-axis to always have 0 as the min. This works, but it sets the max value to the max of both series, instead of adapting when legend changes.
                // chart.yDomain2([0, d3.max(postData[1].values.map(function(d){return d.y;}).concat(postData[2].values.map(function(d){return d.y;})))])
                chart.yAxis2
                    .axisLabel('Number')// TODO: - Missing label - probably margin issue.
                    .tickFormat(d3.format(',g'))


                // TODO: P1 Bug - Unselecting rank causes the scale to reverse and the content to NOT disappear
                d3.select(idToSelector(elId, 'svg'))    //Select the <svg> element you want to render the chart in.
                    .datum(postData)         //Populate the <svg> element with chart data...
                    .call(chart);          //Finally, render the chart!

                //Update the chart when window resizes.
                nv.utils.windowResize(function () {
                    chart.update()
                });
                return chart;
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

