Template.ellipse.rendered = function() {

  const latAcc = Sensors.findOne({
    "name": "Lateral_acc"
  });
  const longAcc = Sensors.findOne({
    "name": "Longitudinal_a"
  })
  // const data = test.values;
  // Sólo coge el minuto 0 segundo 1...
  let latArr = [];
  let longArr = [];


  createData(latAcc.values, latArr)
  createData(longAcc.values, longArr)

  let frictionData = [];

  for (var i = 0; i < latArr.length && i < longArr.length; i++) {
    frictionData[i] = [Number(latArr[i]), Number(longArr[i])];
  }

  console.log(frictionData);

  jQuery('#graph-area').highcharts({
    chart: {
      type: 'scatter',
      zoomType: 'xy'
    },
    title: {
      text: null
    },
    subtitle: {
      text: null
    },
    xAxis: {
      title: {
        text: null
      },
      tickInterval: 0.5,
      // offset: -250,
      max: 2,
      min: -2
    },
    yAxis: {
      title: {
        text: null
      },
      tickInterval: 0.5,
      // offset: -250,
      max: 2,
      min: -2
    },
    legend: {
      enabled: false,
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
      borderWidth: 1
    },
    plotOptions: {
      scatter: {
        animation: false,
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)'
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.x} g, {point.y} g'
        }
      }
    },
    series: [{
      name: 'Acceleration',
      color: 'rgba(0, 0, 0, .5)',
      data: frictionData
    }]
  });

}
