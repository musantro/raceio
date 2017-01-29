Template.test.rendered = function () {
        console.log()
        const test = Sensors.findOne({"name":"Time"});
        const data = test.values;
        // Sólo coge el minuto 0 segundo 1...
        let yData = []


        createData(data,yData)

        yData = yData.map(Number);
        console.log(yData)

    var returnobject = {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: ``,
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            labels: {
                formatter: function() {
                    return this.value / test.sampleRate
                }
            }
        },
        yAxis: {
            title: {
                text: `${test.name}`
            },
        },
        tooltip: {
            crosshairs: [true, true],
        },
        series: [{
            name: `${test.name}`,
            data: yData,
            tooltip: {
              valueSuffix: ` ${test.units}`
            }
        }],

    };

    jQuery('#graph-area').highcharts(returnobject);

};
