Template.upload.onCreated(function() {
    this.currentFile = new ReactiveVar(false);
});

Template.tests.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('tests');
    });
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

// test
Template.tests.helpers({
    tests: function() {
        return Tests.find({})
    }
});

Template.cardtest.events({
    'click .delete': function() {
        Tests.remove(this.id);
        Sensors.find({
            fromTest: this.id
        }).forEach(function(doc) {
            Sensors.remove({
                _id: doc._id
            });
        });
        Meteor.call("removeCSV", this.id);
    }
})
