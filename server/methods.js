Meteor.methods({
    parseUpload(data) {
        // check(data, Array); Para usar esto, https://themeteorchef.com/snippets/using-the-check-package/#tmc-adding-check

        var result = {};
        var fileId = Files.insert({})

        // parseUpload guarda los datos parseados en el mejor formato Time-Series
        
        var freq = 1 / Number(data[2][2].replace(',', '.')); // Lo usaremos para truncar los datos en segundos


        for (var nRows = 0; nRows < data[data[1].length - 1].length; nRows++) {
            var nColumns = 0;
            var k = 0;
            var nObjValue = -1;
            do {
                if (nColumns == 0) {
                    result = {
                        type: data[nColumns][nRows],
                        values: {},
                    }
                    nColumns++;
                } else {
                    nObjValue++;
                    for (var k = 0; k < freq && nColumns + k < data.length - 1; k++) {
                        if (k == 0) {
                            result.values[nObjValue] = {};

                        };
                        // console.log("data[", nColumns, " + ", k, "][", nRows, "] = ", data[nColumns + k][nRows]);
                        value = Number(data[nColumns + k][nRows].replace(',', '.'));
                        result.values[nObjValue][k] = value;

                    }
                };
                console.log(fileId, result.values[nObjValue]);
                Files.update({_id: "fileId"}), {$push: {values: result.values[nObjValue]}};
                nColumns = nColumns + k
            } while (nColumns < data.length - 1);
            Files.insert(result);
        }
    }
})
