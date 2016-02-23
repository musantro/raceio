Template.callout.events({
	"click #btnReadCSV": function(event, template){
		Papa.parse(template.find('#csv-file').files[0], {
			header: true,
			step: function(row){
				console.log("Row:", row.data)
			}
			complete: function() {
				console.log("All done!")
			},
		});
	}
});