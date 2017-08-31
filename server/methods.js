Meteor.methods({

  'storeTest': function(file) {    // Creamos documento en la colección Tests para trabajar con la _id
    Tests.insert({
      _id: file._id
    });

    // Inicializamos variables; activamos cronómetro con la variable start
    let start = Date.now(),
      lineNum = 0,
      emptyRows = 0,
      bufArr = [],
      sensorNames, freq, beaconMarkers;

    // Inicializamos lap y nextSecond
    var lap = 1,
      nextSecond = 1;

    // Creamos una cola de trabajo para el guardado en mongoDB
    var bulk = Sensors.rawCollection().initializeOrderedBulkOp();

    // activamos paquetes npm: fast-csv, line-by-line
    var csv = require('fast-csv'),
      LineByLineReader = require('line-by-line'),
      lr = new LineByLineReader(file.path);

      console.log(`New upload in progress... ${file._id}`);
    // Si line-by-line da error, nos lo muestra
    lr.on('error', function(err) {
      // 'err' contiene un objeto error
      console.error(`Error: ${err.reason}`)
    });

    // esta función se ejecutará tantas veces como líneas se hagan
    lr.on('line', Meteor.bindEnvironment(function(line) {
      lineNum++;
      // 'line' contiene la línea actual leída sin el carácter de nueva linea \n
      if (line.length == 0) {
        emptyRows++
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
            tr[j][i - 1] = {
              "t": arr[i][0],
              "v": arr[i][j]
            }
          }
        }
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

  'deleteTest': function(id) {
    Tests.remove(id);
    Csvs.remove(id);
    Sensors.remove({
      'fromTest': id
    });
  },

  'getEllipse': function(id) {
    var lat = Sensors.aggregate(
      {$match: {"fromTest": id, "name": "Lateral_acc"}},
      {$group: {_id: null, v:{$push: "$data.v"}}},
    );

    var long = Sensors.aggregate(
      {$match: {"fromTest": id, "name": "Longitudinal_a"}},
      {$group: {_id: null, v:{$push: "$data.v"}}},
    );

    return _.zip(_.flatten(lat[0].v), _.flatten(long[0].v));
    ;
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
