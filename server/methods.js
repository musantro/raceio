Meteor.methods({
    parseRow(row, ID) {
        // Papaparse creates a nested array. So let's un-nest it.
        row = row[0];
        // Let's define our main key (ONLY FOR METADATA)
        var key = row[0];
        // Check in db where to store the row
        var saveLocation = Tests.findOne({ _id: ID })["current"]
        console.log("Row: ", row, "\nrow.length = ", row.length, "row[0]= ", row[0], " isLineBreak? ", isLineBreak(row));

        // Do it!
        if (isLineBreak(row)) {
            saveLocation = Tests.update({ _id: ID }, {
                $set: {
                    ["current"]: "header"
                }
            });
        } else {
            save(row, saveLocation, key);
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
            for (var i = 0; i < row.length; ++i)
                obj[i] = row[i];

            Tests.update({ _id: ID }, {
                $push: {
                    [where]: {
                        [key]: obj,
                    }
                }
            });
        };


    },
})
