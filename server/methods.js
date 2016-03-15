Meteor.methods({
    parseRow(row, ID) {
        // Papaparse creates a nested array. So let's un-nest it.
        row = row[0];

        // Check in db where to store the row
        var saveLocation = Tests.findOne({ _id: ID })["current"]
        console.log("row.length = ", row.length, "row[0]= ", row[0], " isLineBreak? ", isLineBreak(row), "saveLocation: ", saveLocation);

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
                            ["current"]: "values"
                        }
                    })
                    break;
            }

        } else {
            save(row, saveLocation);
        }



        // FUNCTIONS

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
                    $set: {[where + "." + key]: obj }
                });
            } else if (where == "header") {
                for (var i = 0; i < row.length; ++i)
                    obj[i] = row[i];
                Tests.update({ _id: ID }, {
                    $push: {
                        [where]: obj,
                    }
                })
            } else if (where == "values") {
                for (var i = 0; i < row.length; ++i)
                    obj[i] = row[i];
                Tests.update({ _id: ID }, {
                    $push: {
                        [where]: obj,
                    }
                });
            }
        };


    },
})
