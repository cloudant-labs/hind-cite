'use strict';

var chartPost = (function ($, _, Rickshaw) {

    function chart() {
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
                out.push({x: Date.parse(d.timestamp_str)/1000, y: d.rank})
            });

            console.log('dataCloudantToRickshaw. ', data, '-->', out);
            return out;
        }

        function idToSelector(id, elName) {
            if (!_.contains(['chart', 'y_axis', 'x_axis'], elName)) {
               throw new Error('idToSelector - unexpected element name: ', elName);
            }

            return '#'+id+' .'+ elName;
        }

        function draw(config) {

            if (!config || !config.data) {
                throw new Error('snapsPerDay.draw - missing config.data: ', config);
            }

            var postData=dataCloudantToRickshaw(config.data);
            var postScale=d3.scale.linear()
                .domain([0,60])
                .range([60,0])
                .nice();  // Note - this is NOT working the way I expect.  The chart looks right, but the axis does not.

            graph = new Rickshaw.Graph({
                element: document.querySelector(idToSelector(elId, 'chart')),
                renderer: 'line',
                width : chartSize.width,
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


    return {
        chart: chart
    };

}($, _, Rickshaw));

