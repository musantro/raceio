Template.callout.events({
    "click #btnReadCSV": function storeData(event, template) {


        function store(data) {
    		// Guarda los datos parseados en parseData

            Files.insert(data);
            console.log("Stored ",data.length," rows of data. Awesome")
        };

        function parseData(url, callBack) {
            Papa.parse(url, {
                header: true,
                complete: function(results) {
                    console.log("Parsing done!");
                    callBack(results.data)
                }
            });
        }

        parseData(template.find('#csv-file').files[0], store);
    }
});
