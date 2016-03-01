Template.header.events({
    "click .button-collapse": function(event, template) {
        template.$(".button-collapse").sideNav({
            closeOnClick: true
        });
    }
})

Template.upload.events({
    'change [name="uploadCSV"]' (event, template) {
        template.uploading.set(true);

        Papa.parse(event.target.files[0], {
            header: false,
            complete: function(results) {
                template.uploading.set(false)
                Meteor.call('parseUpload', results.data, (error, response) => {
                    if (error) {
                        console.log(error.reason);
                    } else {
                        template.uploading.set(false);
                        Materialize.toast("Parsing complete!", 4000);
                    }
                });
            }
        });
        Materialize.toast("Upload complete!", 4000);
    }
});
