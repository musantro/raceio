Meteor.methods({

    'bench': function(file) {
        var csv = require('fast-csv');
        var fs = require('fs');
        var rows = 0;
        var now = Date.now();

        Tests.insert({
            _id: file._id,
            current: "meta",
        });

        Meteor.setTimeout(function() {
            var stream = fs.createReadStream(file.path)
                .pipe(csv())
                .on('readable', Meteor.bindEnvironment(function() {
                    rows++
                    var row;
                    while (null !== (row = stream.read())) {
                      if (rows <= 30) {
                        // console.log(rows, " Rows counted")
                        console.log("# ",rows," ",row)
                        parseRow(row, file._id)
                      };
                    }
                }, function(error) {
                    console.log(error);
                }))
                .on('error', function(err) {
                    console.log('Error reading File');
                })
                .on('end', function(count) {
                    console.log('parsed ' + count + ' rows in ' + (Date.now() - now) / 1000 + ' s');
                })
        }, 1000)

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
