
Template.testSingle.onRendered(function() {
    $('select').material_select();
})

Template.testSingle.events({
    "change #select-sensors": function(event, template) {
        sensors = template.$('#select-sensors').val()
        plotIt(sensors);

        function plotIt(sensors) {

            var returnobject = {
                chart: {
                    zoomType: 'x'
                },

                xAxis: {
                    title: {
                        text: 'Time'
                    },
                    labels: {
                        formatter: function() {
                            return this.value / testObject.meta["Sample Rate"];
                        }
                    }
                },
                yAxis: [],

                tooltip: {
                    crosshairs: [true],
                    formatter: function() {
                        return Math.round(this.y) + " " + this.series.name
                    }
                },
                series: []

            };

            for (var i = 0; i < sensors.length; i++) {
                if (i == 0) {
                    returnobject.yAxis.push({
                        title: {
                            text: testObject.sensor[sensors[i]].customName,
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        },
                        labels: {
                            format: '{value} ' + testObject.sensor[sensors[i]].units,
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        }
                    })
                } else {
                    returnobject.yAxis.push({
                        title: {
                            text: testObject.sensor[sensors[i]].customName,
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        },
                        labels: {
                            format: '{value} ' + testObject.sensor[sensors[i]].units,
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        },
                        opposite: true
                    })
                }
                returnobject.series.push({
                    name: testObject.sensor[sensors[i]].customName,
                    data: testObject.sensor[sensors[i]].values,
                    yAxis: i
                })
            }
            //return object

            jQuery('#graph-area').highcharts(returnobject);
        }
    }
})
