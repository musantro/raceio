Template.dashboard.events({
    "click #btnReadCSV": function storeData(event, template) {
        var result = {};

        function store(data) {
            // Guarda los datos parseados en parseData
            var freq = 1 / Number(data[2][2].replace(',', '.')); // Lo usaremos para truncar los datos en segundos


            console.log("data[1].length = ", data[1].length, "\n", "data.length = ", data.length, "\n", "freq = ", freq);
            for (var nRows = 0; nRows < data[data[1].length-1].length; nRows++) {
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

                        } // Pasar al sistema americano de notación decimal          
                    };
                    nColumns = nColumns + k
                } while (nColumns < data.length - 1);
                Files.insert(result)
            }
            console.log("Stored ", data.length, " rows of data.\nAwesome!")
        };

        function parseData(url, callBack) {
            Papa.parse(url, {
                header: false,
                complete: function(results) {
                    console.log("Parsing done! \n", results.data);
                    callBack(results.data);
                }
            });
        }

        parseData(template.find('#csv-file').files[0], store);
    }
});
