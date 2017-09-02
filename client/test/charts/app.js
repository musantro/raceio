Template.charts.rendered = function() {

  const id = Router.current().params._id;
  const sampleRate = Number(Tests.findOne(id).meta["Sample Rate"]);

  Meteor.call('getData', id, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      printData(result)
    }
  })

  let printData = function(yData) {
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
      yAxis: {
        title: {
          text: "yAxis"
        },
      },
      tooltip: {
        enabled: false,
        crosshairs: [true, true],
      },
      series: [{
        name: `nameSeries`,
        data: yData,
        tooltip: {
          valueSuffix: ` units`
        }
      }],

    };
    jQuery('#graph-area').highcharts(returnobject);
  }

};
