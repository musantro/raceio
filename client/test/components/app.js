Template.test.rendered = function () {
        console.log()
        const test = Sensors.findOne({"name":"RPM"})
        const data = test.values[0][0];
        var yData = Object.values(data).map(function(k){return Number(k)})
        var xData = Object.keys(data).map(function(k){return Number(k)});

    var returnobject = {
        chart: {
            // type: 'area',
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

    }; //return object

    jQuery('#graph-area').highcharts(returnobject);

};
