Template.callout.events({
    "click #btnReadCSV": function storeData(event, template) {
        var result = {};

        function store(data) {
            // Guarda los datos parseados en parseData
            var freq = 1 / Number(data[2][2].replace(',', '.')); // Lo usaremos para truncar los datos en segundos


            console.log("data[1].length = ", data[1].length, "\n", "data.length = ", data.length, "\n", "freq = ", freq);
            for (var i = 0; i < data[data[1].length-1].length; i++) {
                var j = 0;
                var k = 0;
                var n = -1;
                do {
                    if (j == 0) {
                        result = {
                            type: data[j][i],
                            values: {},
                        }
                        j++;
                    } else {
                        n++;
                        for (var k = 0; k < freq; k++) {
                            if (k == 0) {
                                result.values[n] = {};

                            };
                            // console.log("data[", j, " + ", k, "][", i, "] = ", data[j + k][i]);
                            value = Number(data[j + k][i].replace(',', '.'));
                            result.values[n][k] = value;

                        } // Pasar al sistema americano de notación decimal          
                    };
                    j = j + k
                } while (j < data.length - 1);
                Files.insert(result)
            }
            console.log("Stored ", data.length, " rows of data. Awesome!")
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
