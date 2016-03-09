Meteor.methods({
    parseRow(row, ID) {

        function exists(type, callback){
            if(Tests.findOne({
                _id: ID,
                "exists[type]": true,
            })){
                return true;
            } else {return false;};
        };
        
        function save(arr) {

        };

        function isLineBreak(arr){

        };

        if (!exists("meta") && !exists("header") && !exists("units") && !exists("sensor")) {
            Tests.update({ _id: ID}, {$set: {"exists.meta": true}});
            // and save row
        } 

    }
})
