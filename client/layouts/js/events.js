Template.header.onRendered(function() {
    $('.dropdown-button').dropdown({
    	belowOrigin: true,
    	hover: true,
    });
});

Template.header.onRendered(function() {
	$('.button-collapse').sideNav({
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
})

// Function createData converts time Series object to array for Highcharts
createData = function(obj, arr){
  for (var i in obj) {
    if (typeof obj[i] === 'object'){
      createData(obj[i],arr)
    } else {
      arr.push(obj[i])
    }
  }
}

plotIt = function(data, sensors, sampleRate) {
    var returnobject = {
        chart: {
            zoomType: 'x'
        },
        plotOptions: {
          series: {
            animation: false
          }
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
                    return this.value / sampleRate
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
        let sensor = Sensors.findOne({
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

        returnobject.series.push({
            name: sensor.customName,
            yAxis: i,
            data: data[i],
            tooltip: {
              valueSuffix: ` ${sensor.units}`
            }
        })
    }

    jQuery('#graph-area').highcharts(returnobject);
}
