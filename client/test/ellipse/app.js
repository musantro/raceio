Template.ellipse.rendered = function() {

  const id = Router.current().params._id;

  Meteor.call('getEllipse', id, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      bam(result);
    }
  })

let bam = function(frictionData) {
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
      color: 'rgba(0, 0, 0, .3)',
      data: frictionData
    }]
  });
}

}
