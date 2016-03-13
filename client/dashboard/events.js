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


        newFile = Tests.insert({

            current: "meta",
            exists: {
                meta: false,
                header: false,
                units: false,
                sensors: false
            },
        })

        Papa.parse(event.target.files[0], {
            header: false,
            // preview: 25,
            step: function(row) {
                Meteor.call('parseRow', row.data, newFile, (error, response) => {
                    if (error) {
                        console.log(error.reason);
                    }
                });
            },
            complete: function() {
                template.uploading.set(false)
            }
        });
        Materialize.toast("Upload complete!", 4000);
    }
});
