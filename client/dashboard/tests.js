Template.upload.onCreated(function() {
    this.currentFile = new ReactiveVar(false);
});

// UPLOAD FILE AND PARSE IT
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
                    Meteor.call("storeTest", fileObj, function(error, result) {
                        if (error) {
                            console.log("error", error);
                        }
                        if (result) {
                            Materialize.toast("storeTest done", 4000);
                        }
                    });
                });

                uploadInstance.start();
            }
        }
    }
});

// Esto establece si se está subiendo algo o no
Template.upload.helpers({
    currentFile: function() {
        return Template.instance().currentFile.get();
    }
});


// Esto es para sacar los key-values
Template.registerHelper("objectToPairs", function(object) {
    return _.map(object, function(value, key) {
        return {
            key: key,
            value: value
        };
    });
});


Template.cardtest.events({
    'click .delete': function() {
        Meteor.call("deleteTest", this.id);
    }
})
