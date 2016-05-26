// header

Template.header.events({
    "click .button-collapse": function(event, template) {
        template.$(".button-collapse").sideNav({
            closeOnClick: true
        });
    }
})


// testSingle

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



// upload
Template.upload.events({
    'change [name="uploadCSV"]': function(event, template) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            // We upload only one file, in case
            // there was multiple files selected
            var file = event.currentTarget.files[0];
            if (file) {
                var uploadInstance = Csvs.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic'
                }, false);

                uploadInstance.on('start', function() {
                    template.currentFile.set(this);
                });

                uploadInstance.on('error', function(error) {
                    console.error(error);
                    template.currentFile.set(false);
                });

                uploadInstance.on('end', function(error, fileObj) {
                    if (error) {
                        Materialize.toast('Error during upload: ' + error.reason, 4000)
                    } else {
                        Materialize.toast('File "' + fileObj.name + '" successfully uploaded', 4000)
                    }
                    template.currentFile.set(false);
                    Meteor.call("bench", fileObj, function(error, result) {
                        if (error) {
                            console.log("error", error);
                        }
                        if (result) {
                            Materialize.toast("Bench done", 4000);
                        }
                    });
                });

                uploadInstance.start();
            }
        }
    }
});
