Meteor.methods({

  // Right now this function supposes that CSV file has not resets in Time column.
  // This is not always true, as Race Studio has Beacon Markers.
  // Upcoming: Taking into account every option Race Studio has with Beacon Markers
  // and implement it for easier UX.

  'storeTest': function(file) {
    Tests.insert({
      _id: file._id
    });

    let start = Date.now(),
      lineNum = 0,
      emptyRows = 0,
      bufArr = [],
      sensorNames, freq, beaconMarkers;

    var lap = 1,
      nextSecond = 1;

    console.log(`typeof nextSecond: ${typeof nextSecond}`);
    console.log(`typeof lap: ${typeof lap}`);

    var bulk = Sensors.rawCollection().initializeOrderedBulkOp();

    var csv = require('fast-csv'),
      LineByLineReader = require('line-by-line'),
      lr = new LineByLineReader(file.path);

    lr.on('error', function(err) {
      // 'err' contains error object
      console.error(`Error: ${err.reason}`)
    });
    lr.on('line', Meteor.bindEnvironment(function(line) {
      lineNum++;
      // 'line' contains the current line without the trailing newline character.
      if (lineNum % 1000 === 0) {
        console.log(`${lineNum} rows readed`);
      }
      if (line.length == 0) {
        emptyRows++
        console.log(`Empty line at ${lineNum + 1}`)
        switch (emptyRows) {
          case 1:
            let arrMeta = bufArr;
            bufArr = []
            store.metadata(arrMeta);
            break;
          case 2:
            let arrSensors = bufArr;
            bufArr = []
            store.sensors(arrSensors);
            break;
        }
      } else {
        csv
          .fromString(line)
          .on("data", function(data) {
            if (emptyRows < 2) {
              bufArr.push(data)
            } else {
              data = data.map(Number);
              if (data[0] >= nextSecond) {
                arrValues = bufArr;
                store.values(arrValues, nextSecond - 1, lap)
                nextSecond++;
                bufArr = [];
                bufArr.push(data)
              } else if (beaconMarkers.some(elem => elem === data[0])) {
                bufArr.push(data)
                arrValues = bufArr;
                store.values(arrValues, nextSecond - 1, lap)
                lap++;
                nextSecond = 1;
                bufArr = [];
              } else {
                bufArr.push(data)
              }
            }
          })
          .on("end", function() {});
      }
    }));

    lr.on('end', function() {
      // All lines are read, file is closed now.
      bulk.execute(function(error) {
        return error;
      })
      console.log(`Read finished: ${(Date.now()-start)/1000}s, ${lineNum} lines`);
    });



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

        freq = Number(metaObj["Sample Rate"])
        beaconMarkers = metaObj["Beacon Markers"].split(", ").map(Number)

        for (var i = 1; i < beaconMarkers.length; i++) {
          beaconMarkers[i] = beaconMarkers[i] - beaconMarkers[i - 1]
        };

        console.log(`Sample Rate: ${freq} Hz`)
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
        sensorArr = [];
        for (var i = 0; i < arr[0].length; i++) {
          sensorArr[i] = {
            "fromTest": file._id,
            "name": arr[0][i],
            "customName": arr[1][i],
            "units": arr[2][i],
            "sensorId": arr[3][i],
            "sampleRate": freq
          }
        }
        return
      },
      values: function(arr, second, lap) {

        var tr = new Array(sensorArr.length);
        for (var i = 1; i < arr.length; i++) {
          for (var j = 0; j < arr[i].length; j++) {
            if (tr[j] === undefined) {
              tr[j] = [];
            }
            tr[j][i-1] = {
              "t": arr[i][0],
              "v": arr[i][j]
            }
          }
        }
        // console.log(`arr is ${arr.length} wide`)
        // console.log(`tr is ${tr.length} wide`)
        for (var i = 1; i < sensorArr.length; i++) {
          bulk.insert({
            ...sensorArr[i],
            "lap": lap,
            "second": second,
            "data": tr[i]
          })
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

Meteor.publish('Tests', function() {
  return Tests.find({});
});
