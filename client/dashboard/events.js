// upload
Template.upload.events({
    'change [name="uploadCSV"]': function(event, template) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            // We upload only one file, in case
            // there was multiple files selected
            var file = event.currentTarget.files[0];
            if (file) {
                var uploadInstance = Csvs.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic'
                }, false);

                uploadInstance.on('start', function() {
                    template.currentFile.set(this);
                });

                uploadInstance.on('error', function(error) {
                    console.error(error);
                    template.currentFile.set(false);
                });

                uploadInstance.on('end', function(error, fileObj) {
                    if (error) {
                        Materialize.toast('Error during upload: ' + error.reason, 4000)
                    } else {
                        Materialize.toast('File "' + fileObj.name + '" successfully uploaded', 4000)
                    }
                    template.currentFile.set(false);
                    Meteor.call("bench", fileObj, function(error, result) {
                        if (error) {
                            console.log("error", error);
                        }
                        if (result) {
                            Materialize.toast("Bench done", 4000);
                        }
                    });
                });

                uploadInstance.start();
            }
        }
    }
});
