
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
                    crosshairs: [true],
                    formatter: function() {
                        return this.y + " " + sensor.units
                    }
                },
                series: []

            };

            for (var i = 0; i < sensors.length; i++) {
              var sensor = Sensors.findOne({"name":sensors[i]})
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
                returnobject.series.push({
                    name: sensor.customName,
                    data: Object.values(sensor.values[0][1]).map(function(k){return Number(k)}),
                    yAxis: i
                })
            }
            //return object

            jQuery('#graph-area').highcharts(returnobject);
        }
    }
})
