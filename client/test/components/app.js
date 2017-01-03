Template.test.rendered = function () {
        console.log()
        const test = Sensors.findOne({"name":"RPM"});
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
            text: 'Time vs RPM',
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
                text: 'RPM'
            },
        },
        tooltip: {
            crosshairs: [true],
            formatter: function() {
                return Math.round(this.y) + " " + this.series.name
            }
        },
        series: [{
            name: 'RPM',
            data: yData
        }],

    };

    jQuery('#graph-area').highcharts(returnobject);

};
