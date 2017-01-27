Template.test.onRendered(function() {
    $('select').material_select();
})

Template.test.events({
    "change #select-sensors": function(event, template) {
        sensors = template.$('#select-sensors').val()
        plotIt(sensors);

        function plotIt(sensors) {
            const test = Sensors.findOne({})
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
                            return this.value / test.sampleRate
                        }
                    }
                },
                yAxis: [],

                tooltip: {
                    crosshairs: [true,true],
                    shared: true
                },
                series: []

            };

            for (var i = 0; i < sensors.length; i++) {
                var sensor = Sensors.findOne({
                    "name": sensors[i]
                })
                if (i == 0) {
                    returnobject.yAxis.push({
                        title: {
                            text: sensors[i],
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        },
                        labels: {
                            format: '{value} ' + sensor.units,
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        }
                    })
                } else {
                    returnobject.yAxis.push({
                        title: {
                            text: sensor.customName,
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        },
                        labels: {
                            format: '{value} ' + sensor.units,
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        },
                        opposite: true
                    })
                }
                createData(sensor.values, data = []);
                data = data.map(Number);

                returnobject.series.push({
                    name: sensor.customName,
                    data: data,
                    yAxis: i,
                    tooltip: {
                      valueSuffix: ` ${sensor.units}`
                    }
                })
            }

            jQuery('#graph-area').highcharts(returnobject);
        }
    }
})
