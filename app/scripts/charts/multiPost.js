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




            function dataCloudantToNV(raw, metric) {
                var rawSeries, outSeries, out = [];

                for (var key in raw) {
                    if (key == 'timestamp') {
                        continue;
                    }

                    rawSeries = raw[key];
                    outSeries = {
                        key: rawSeries.title, //.substring(0,10),
                        id: rawSeries.id,
                        title: rawSeries.title,
                        values: []
                    };

                    var t0 = rawSeries.history[0].timestamp_d.getTime();
                    rawSeries.history.forEach(function (snap) {
                        outSeries.values.push({x: (snap.timestamp_d.getTime() - t0) / (1000 * 60 * 60), y: snap[metric]}) // Time in hours since first snap
                    });

                    out.push(outSeries);
                }

                console.log('dataCloudantToNV. ', raw, '-->', out);
                return out;
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


            function draw(config) {

                if (!config || !config.data || !config.metric) {
                    throw new Error('snapsPerDay.draw - missing config.data: ', config);
                }

                var postData = dataCloudantToNV(config.data, config.metric);

                nv.addGraph(function () {
                    nvChart = nv.models.lineChart()
                        .margin({top: 30, right: 50, bottom: 50, left: 50})
                        .useInteractiveGuideline(true)

                    nvChart.legend.key(function(d) {return d.key.substring(0,10)});


                    nvChart.xAxis
                        .axisLabel('Hours From First Post')
                        .tickFormat(d3.format('.0f'))
                        .tickValues(_.range(0,2000,6))


                    if (config.metric === 'rank') {
                        nvChart.yDomain([60, 1])
                    }

                    nvChart.yAxis
                        .axisLabel(_.toTitleCase(config.metric))
                        .axisLabelDistance(50)
                        .tickValues([1,30,60])
                        .tickFormat(d3.format('d'));


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

    }
        ($, _, nv)
        )
    ;

