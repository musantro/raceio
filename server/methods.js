Meteor.methods({
    parseRow(row, ID) {
        // Papaparse creates a nested array. So let's un-nest it.
        row = row[0];

        // Check in db where to store the row
        var saveLocation = Tests.findOne({ _id: ID })["current"]
            // Do it!
        if (isLineBreak(row)) {
            switch (saveLocation) {
                case "meta":
                    saveLocation = Tests.update({ _id: ID }, {
                        $set: {
                            ["current"]: "header"
                        }
                    })
                    break;
                case "header":
                    saveLocation = Tests.update({ _id: ID }, {
                        $set: {
                            ["current"]: "sensor"
                        }
                    })
                    break;
            }

        } else {
            save(row, saveLocation);
        }



        // FUNCTIONS
        function exists(parent, prop, callback) {
            if (Tests.findOne({ '_id': ID, [parent + "." + prop]: { $exists: true } })) {
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
                Tests.update({ _id: ID }, {
                    $set: {
                        [where + "." + key]: obj
                    }
                });
            } else if (where == "header") {
                for (var i = 0; i < row.length; ++i) {
                    obj[i] = row[i];
                    if (!exists("sensor." + i, "name")) {
                        Tests.update({ _id: ID }, {
                            $set: {
                                ["sensor." + i + ".name"]: obj[i],
                            }
                        })
                    } else if (!exists("sensor." + i, "customName")) {
                        Tests.update({ _id: ID }, {
                            $set: {
                                ["sensor." + i + ".customName"]: obj[i],
                            }
                        })
                    } else if (!exists("sensor." + i, "units")) {
                        Tests.update({ _id: ID }, {
                            $set: {
                                ["sensor." + i + ".units"]: obj[i],
                            }
                        })
                    } else if (!exists("sensor." + i, "number")) {
                        Tests.update({ _id: ID }, {
                            $set: {
                                ["sensor." + i + ".number"]: obj[i],
                            }
                        })
                    };
                };
            } else if (where == "sensor") {
                for (var i = 0; i < row.length; ++i) {
                    Tests.update({ _id: ID }, {
                        $push: {
                            ["sensor." + i + ".values"]: Number(row[i]),
                        }
                    });
                };
            }
        };


    },
})
