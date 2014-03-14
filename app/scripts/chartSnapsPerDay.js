'use strict';

var chartSnapsPerDay = (function ($, _, Rickshaw) {

    function test() {
        var data= [
            {
                name: "Northeast",
                data: [ { x: -1893456000, y: 25868573 }, { x: -1577923200, y: 29662053 }, { x: -1262304000, y: 34427091 }, { x: -946771200, y: 35976777 }, { x: -631152000, y: 39477986 }, { x: -315619200, y: 44677819 }, { x: 0, y: 49040703 }, { x: 315532800, y: 49135283 }, { x: 631152000, y: 50809229 }, { x: 946684800, y: 53594378 }, { x: 1262304000, y: 55317240 } ],
            },
            {
                name: "Midwest",
                data: [ { x: -1893456000, y: 29888542 }, { x: -1577923200, y: 34019792 }, { x: -1262304000, y: 38594100 }, { x: -946771200, y: 40143332 }, { x: -631152000, y: 44460762 }, { x: -315619200, y: 51619139 }, { x: 0, y: 56571663 }, { x: 315532800, y: 58865670 }, { x: 631152000, y: 59668632 }, { x: 946684800, y: 64392776 }, { x: 1262304000, y: 66927001 } ],
            },
            {
                name: "South",
                data: [ { x: -1893456000, y: 29389330 }, { x: -1577923200, y: 33125803 }, { x: -1262304000, y: 37857633 }, { x: -946771200, y: 41665901 }, { x: -631152000, y: 47197088 }, { x: -315619200, y: 54973113 }, { x: 0, y: 62795367 }, { x: 315532800, y: 75372362 }, { x: 631152000, y: 85445930 }, { x: 946684800, y: 100236820 }, { x: 1262304000, y: 114555744 } ],
            },
            {
                name: "West",
                data: [ { x: -1893456000, y: 7082086 }, { x: -1577923200, y: 9213920 }, { x: -1262304000, y: 12323836 }, { x: -946771200, y: 14379119 }, { x: -631152000, y: 20189962 }, { x: -315619200, y: 28053104 }, { x: 0, y: 34804193 }, { x: 315532800, y: 43172490 }, { x: 631152000, y: 52786082 }, { x: 946684800, y: 63197932 }, { x: 1262304000, y: 71945553 } ],
            }
        ];



        var palette = new Rickshaw.Color.Palette();

        // RR set colors
        data.forEach(function(d){d.color=palette.color()});

        var graph = new Rickshaw.Graph( {
            element: document.querySelector("#chart"),
            width: config.medChartSize.width,
            height: config.medChartSize.height,
            renderer: 'line',
            series: data //RR
        });


        var x_axis = new Rickshaw.Graph.Axis.Time( {
            graph: graph,
            element: document.getElementById('x_axis')
        } );

        var y_axis = new Rickshaw.Graph.Axis.Y( {
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis'),
        } );

        var legend = new Rickshaw.Graph.Legend( {
            element: document.querySelector('#legend'),
            graph: graph
        } );

        var offsetForm = document.getElementById('offset_form');

        offsetForm.addEventListener('change', function(e) {
            var offsetMode = e.target.value;

            if (offsetMode == 'lines') {
                graph.setRenderer('line');
                graph.offset = 'zero';
            } else {
                graph.setRenderer('stack');
                graph.offset = offsetMode;
            }
            graph.render();

        }, false);

        graph.render(Rickshaw);
    }

    function snapsPerDay(){
        var elId, chartSize, data, graph;

        function init(config) {
            if (!config || ! config.elId || ! config.chartSize) {
                throw new Error('snapsPerDay.init - missing config properties: ', config);
            }

            elId=config.elId;
            chartSize=config.chartSize;
            data=config.data;


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
        function dataCloudantToRickshaw(data){
            var out=[];
            data.forEach(function(d,i){
                out.push({x: i, y: d.value})
            })

            console.log('dataCloudantToRickshaw. ', data, '-->', out);
            return out;
        }

        function draw(config) {

            if (!config || !config.data){
                throw new Error('snapsPerDay.draw - missing config.data: ', config);
            }

            graph = new Rickshaw.Graph({
                element: document.querySelector('#'+elId + ' .chart'),
                renderer: 'bar',
                series: [{
                    data: dataCloudantToRickshaw(config.data),
                    color: 'steelblue'
                }]
            });

            graph.render();
        }

        return {
            init : init,
            draw : draw
        }
    }


    return {
        test : test,
        snapsPerDay : snapsPerDay
    };

}($, _, Rickshaw));

