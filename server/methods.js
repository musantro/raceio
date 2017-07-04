Meteor.methods({

    // Right now this function supposes that CSV file has not resets in Time column.
    // This is not always true, as Race Studio has Beacon Markers.
    // Upcoming: Taking into account every option RaceStudio has with Beacon Markers
    // and implement it for easier UX.

    'storeTest': function(file) {
        var csv = require('fast-csv');
        var fs = require('fs');

        var bulk = Sensors.rawCollection().initializeOrderedBulkOp();
        var now = Date.now();
        var rows = 0
        var emptyRows = 0
        var arrMeta = [];
        var arrSensors = [];
        var countRow = 0;
        var sensorNames;
        var currentStack = [];

        Tests.insert({
            _id: file._id
        });

        var stream = fs.createReadStream(file.path)
            .pipe(csv())
            .on('readable', Meteor.bindEnvironment(function() {
                rows++
                if (rows % 1000 === 0) {
                    console.log(rows + " readed")
                }
                var row;

                while (null !== (row = stream.read())) {
                    if (rows <= 750) {
                        if (emptyRows < 2) {
                            if (row.length == 0) {
                                emptyRows++
                                switch (emptyRows) {
                                    case 1:
                                        store.metadata(arrMeta);
                                        arrMeta = null;
                                        break;

                                    case 2:
                                        sensorNames = store.sensors(arrSensors);
                                        arrSensors = null;
                                        break;
                                }
                            } else {
                                if (emptyRows === 0) {
                                    arrMeta.push(row);
                                } else {
                                    arrSensors.push(row);
                                }
                            }
                        } else {
                            // THIRD SECTION
                            if (currentStack.length === 0) {
                                currentStack = new Array(row.length);
                                for (var i = 0; i < row.length; i++) {
                                    currentStack[i] = {};
                                }

                            }
                            for (var i = 0; i < row.length; i++) {
                                var timestamp = Math.round(Number(row[0]) % 1 * 1000);
                                currentStack[i][timestamp] = row[i];
                            }

                            countRow++;
                            if (countRow == sampleRate) {
                                countRow = 0;
                                store.values(currentStack, sensorNames);
                                currentStack = []
                            }
                        }
                    }
                }
            }))
            .on('error', function(err) {
                console.log(err)
            })
            .on('end', Meteor.bindEnvironment(function(count) {
              store.values(currentStack, sensorNames);
              currentStack = []

              bulk.execute(function(error) {
                  return error;
              })
                console.log('parsed ' + count + ' rows in ' + (Date.now() - now) / 1000 + ' s');
            }))

        var store = {
            metadata: function(arr) {
                var metaObj = {};
                for (var i = 2; i < arr.length; i++) {
                    key = arr[i].shift();
                    if (arr[i].length <= 1) {
                        metaObj[key] = arr[i][0]
                    } else {
                        metaObj[key] = arr[i]
                    }
                };

                sampleRate = Number(metaObj["Sample Rate"])
                console.log(sampleRate + " Hz")
                Tests.update({
                    _id: file._id
                }, {
                    $set: {
                        "meta": metaObj
                    }
                });
                return;
            },
            sensors: function(arr) {
                sensorNames = arr[0]
                for (var i = 0; i < arr[0].length; i++) {
                    // console.log(i,"arr[0] = ",arr[0]);
                    Sensors.insert({
                        "fromTest": file._id,
                        "name": arr[0][i],
                        "customName": arr[1][i],
                        "units": arr[2][i],
                        "sensorId": arr[3][i],
                        "sampleRate": sampleRate
                    })
                }
                return sensorNames;
            },
            values: function(arr, sensorNames) {
                for (var i = 0; i < arr.length; i++) {
                    bulk.find({
                        "fromTest": file._id,
                        "name": sensorNames[i]
                    }).update({
                        $set: {
                            ["values." + Math.round(arr[0][0] / 60) + "." + Math.round(arr[0][0])]: arr[i]
                        }
                    });
                }
                return;
            }
        }

    },

    'removeCSV': function(id) {
        Csvs.remove(id);
    }

})

Meteor.publish('Test', function(id) {
    return Sensors.find({
        "fromTest": id
    });
});

Meteor.publish('Meta', function(id) {
    return Tests.find({
        "_id": id
    });
});
