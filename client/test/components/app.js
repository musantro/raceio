Template.test.rendered = function () {
        var yData = testData.sensor[13].values;
        var xData = testData.sensor[0].values;

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
                    return this.value / testData.meta["Sample Rate"];
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
