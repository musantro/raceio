Meteor.methods({
    parseRow(row, ID) {
        row = row[0];
        var saveLocation = Tests.findOne({ _id: ID })["current"]

        function isLineBreak(arr) {
           if(!arr) {
            return true;
           } else {
            return false;
           }
        };

        var rv = {};
        if (saveLocation == "meta") {
            key = row.shift();
        }
        for (var i = 0; i < row.length; ++i)
            rv[i] = row[i];

        function save(row, where, key) {
            console.log(row, where);
            //stores array in document.where in db
            
            Tests.update({ _id: ID }, { $push: {
                    [where]: {[key]: row} } });
        };

        if(isLineBreak(row)){
            saveLocation = "header";
        } else {
            save(row,saveLocation,key);
        }
    },
})
