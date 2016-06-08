Meteor.methods({

    'bench': function(file) {
        var csv = require('csv-parse')
        var fs = require('fs')
        var Fiber = require('fibers');
        var es = require('event-stream');

        var now = Date.now()
        var rows = 0

        Tests.insert({
            _id: file._id,
            current: "meta",
        })

        var s = fs.createReadStream(file.path)
            .pipe(es.split())
            .pipe(es.mapSync(function(line) {
                s.pause();

                line = "\"" + line.toString() + "\"";
                rows++;

                if (rows % 100 == 0 && rows != 0) {
                    console.log(rows)
                };
                console.log("line:\n", line);

                Meteor.bindEnvironment(parseRow(line,file._id))

                s.resume();
            }))
            .on('error', function() {
                console.log('Error reading File')
            })
            .on('end', function() {
                console.log('parsed ' + rows + ' rows in ' + (Date.now() - now) / 1000 + ' s')
            })

        function parseRow(row, ID) {
            // Check in db where to store the row
            var saveLocation = Tests.findOne({
                _id: ID
            })["current"]

            // Do it!
            if (isLineBreak(row)) {
                switch (saveLocation) {
                    case "meta":
                        saveLocation = Tests.update({
                            _id: ID
                        }, {
                            $set: {
                                ["current"]: "header"
                            }
                        })
                        break;
                    case "header":
                        saveLocation = Tests.update({
                            _id: ID
                        }, {
                            $set: {
                                ["current"]: "sensor"
                            }
                        })
                        break;
                }

            } else {
                save(row, saveLocation);
            };



            // FUNCTIONS
            function exists(parent, prop, callback) {
                if (Tests.findOne({
                        '_id': ID,
                        [parent + "." + prop]: {
                            $exists: true
                        }
                    })) {
                    return true;
                } else {
                    return false;
                };
            };

            function isLineBreak(arr) {
                if (arr.length <= 1 && arr[0] === "") {
                    return true;
                } else {
                    return false;
                }
            };

            function save(row, where) {
                var obj = {};

                if (where == "meta") {
                    var key = row.shift();
                    obj = {};
                    for (var i = 0; i < row.length; ++i)
                        obj = row[i];
                    Tests.update({
                        _id: ID
                    }, {
                        $set: {
                            [where + "." + key]: obj
                        }
                    });
                } else if (where == "header") {
                    for (var i = 0; i < row.length; ++i) {
                        obj[i] = row[i];
                        if (!exists("sensor." + i, "name")) {
                            Tests.update({
                                _id: ID
                            }, {
                                $set: {
                                    ["sensor." + i + ".name"]: obj[i],
                                }
                            })
                        } else if (!exists("sensor." + i, "customName")) {
                            Tests.update({
                                _id: ID
                            }, {
                                $set: {
                                    ["sensor." + i + ".customName"]: obj[i],
                                }
                            })
                        } else if (!exists("sensor." + i, "units")) {
                            Tests.update({
                                _id: ID
                            }, {
                                $set: {
                                    ["sensor." + i + ".units"]: obj[i],
                                }
                            })
                        } else if (!exists("sensor." + i, "number")) {
                            Tests.update({
                                _id: ID
                            }, {
                                $set: {
                                    ["sensor." + i + ".number"]: obj[i],
                                }
                            })
                        };
                    };
                } else if (where == "sensor") {
                    for (var i = 0; i < row.length; ++i) {
                        Tests.update({
                            _id: ID
                        }, {
                            $push: {
                                ["sensor." + i + ".values"]: Number(row[i]),
                            }
                        });
                    };
                }
            };

        }
    }
})
