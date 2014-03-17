'use strict';

var chartPost = (function ($, _, Rickshaw, nv) {

    function chartRickshaw() {
        var elId, chartSize, data, graph;

        function init(config) {
            if (!config || !config.elId || !config.chartSize) {
                throw new Error('snapsPerDay.init - missing config properties: ', config);
            }

            elId = config.elId;
            chartSize = config.chartSize;
            data = config.data;


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
        function dataCloudantToRickshaw(data) {
            var out = [];
            data[0].value.history.forEach(function (d, i) {
                out.push({x: Date.parse(d.timestamp_str) / 1000, y: d.rank})
            });

            console.log('dataCloudantToRickshaw. ', data, '-->', out);
            return out;
        }

        function idToSelector(id, elName) {
            if (!_.contains(['chart', 'y_axis', 'x_axis'], elName)) {
                throw new Error('idToSelector - unexpected element name: ', elName);
            }

            return '#' + id + ' .' + elName;
        }

        function draw(config) {

            if (!config || !config.data) {
                throw new Error('snapsPerDay.draw - missing config.data: ', config);
            }

            var postData = dataCloudantToRickshaw(config.data);
            var postScale = d3.scale.linear()
                .domain([0, 60])
                .range([60, 0])
                .nice();  // Note - this is NOT working the way I expect.  The chart looks right, but the axis does not.

            graph = new Rickshaw.Graph({
                element: document.querySelector(idToSelector(elId, 'chart')),
                renderer: 'line',
                width: chartSize.width,
                height: chartSize.height,
                series: [
                    {
                        data: postData,
                        color: 'steelblue',
                        scale: postScale
                    }
                ],
            });

            var xAxis = new Rickshaw.Graph.Axis.Time({
                graph: graph,
            });

            var yAxis = new Rickshaw.Graph.Axis.Y({
                graph: graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.querySelector(idToSelector(elId, 'y_axis')),
                scale: postScale
            });


            graph.render();
        }

        return {
            init: init,
            draw: draw
        }
    }

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
            var nvdata = [];

            var data1 = [];
            data[0].value.history.forEach(function (d, i) {
                data1.push({x: new Date (Date.parse(d.timestamp_str)) , y: d.rank})
            });

            nvdata.push({key: "Rank", values: data1})

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

            var postData = dataCloudantToNV(config.data);

            nv.addGraph(function () {
                var chart = nv.models.lineChart()
                        .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                        .transitionDuration(350)  //how fast do you want the lines to transition?
                        .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                        .showYAxis(true)        //Show the y-axis
                        .showXAxis(true)        //Show the x-axis
                    ;

                chart.xAxis     //Chart x-axis settings
                    .axisLabel('Date')
                    .tickFormat(function(d) {
                        return d3.time.format('%y-%m-%d %H:%M')(new Date(d));
                    });


                chart.yDomain([60,1])
                chart.yAxis     //Chart y-axis settings
                    .axisLabel('Rank')
                    .tickFormat(d3.format('d'));


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

    function chartExample() {
        function init() {
            console.log('chart.init - do nothing');
            d3.select('#chart1')
                .append("svg")
                .style('height', config.medChartSize.svg_height)
                .style('width', config.medChartSize.svg_width)
        }

        function draw() {
            console.log('chart.draw - draw it');
            nv.addGraph(function () {
                var chart = nv.models.discreteBarChart()
                        .x(function (d) {
                            return d.label
                        })    //Specify the data accessors.
                        .y(function (d) {
                            return d.value
                        })
                        .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                        .tooltips(false)        //Don't show tooltips
                        .showValues(true)       //...instead, show the bar value right on top of each bar.
                        .transitionDuration(350)
                    ;

                d3.select('#chart1 svg')
                    .datum(exampleData())
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });

        }

        //Each bar represents a single discrete quantity.
        function exampleData() {
            return  [
                {
                    key: "Cumulative Return",
                    values: [
                        {
                            "label": "A Label",
                            "value": -29.765957771107
                        } ,
                        {
                            "label": "B Label",
                            "value": 0
                        } ,
                        {
                            "label": "C Label",
                            "value": 32.807804682612
                        } ,
                        {
                            "label": "D Label",
                            "value": 196.45946739256
                        } ,
                        {
                            "label": "E Label",
                            "value": 0.19434030906893
                        } ,
                        {
                            "label": "F Label",
                            "value": -98.079782601442
                        } ,
                        {
                            "label": "G Label",
                            "value": -13.925743130903
                        } ,
                        {
                            "label": "H Label",
                            "value": -5.1387322875705
                        }
                    ]
                }
            ]

        }

        return {
            init: init,
            draw: draw
        }
    }

    return {
        chart: chart
    };

}($, _, Rickshaw, nv));

