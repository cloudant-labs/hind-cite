'use strict';

var chartSnapsPerDay = (function ($, _, Rickshaw) {

    function snapsPerDay() {
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
         * [
         {"key":"2014-03-01","value":17160},
         {"key":"2014-03-02","value":17220}
         ]
         * @return [{x: 0, y: value}, ...]
         */
        function dataCloudantToRickshaw(data) {
            var out = [];
            data.forEach(function (d, i) {
                out.push({x: Date.parse(d.key)/1000, y: d.value})
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

            graph = new Rickshaw.Graph({
                element: document.querySelector(idToSelector(elId, 'chart')),
                renderer: 'bar',
                width : chartSize.width,
                height: chartSize.height,
                series: [
                    {
                        data: dataCloudantToRickshaw(config.data),
                        color: 'steelblue'
                    }
                ]
            });

            var xAxis = new Rickshaw.Graph.Axis.Time({
                graph: graph,
                //element: document.querySelector(idToSelector(elId, 'x_axis'))

            });

            var yAxis = new Rickshaw.Graph.Axis.Y({
                graph: graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.querySelector(idToSelector(elId, 'y_axis'))
            });


            graph.render();
        }

        return {
            init: init,
            draw: draw
        }
    }


    return {
        snapsPerDay: snapsPerDay
    };

}($, _, Rickshaw));

