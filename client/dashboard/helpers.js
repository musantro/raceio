// Esto establece si se está subiendo algo o no
Template.upload.helpers({
    currentFile: function() {
        return Template.instance().currentFile.get();
    }
});

// Esto es para crear fake text
Template.dashboard.helpers({
    fakeTitle: function() {
        return Fake.sentence(2)
    },
    fakeParagraph: function() {
        return Fake.paragraph(5)
    }
})

Template.tests.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('tests');
    });
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

// testSingle

// Esto es para preparar el dropdown de sensores
Template.testSingle.helpers({
    tag: function() {
        var arr = [],
            sensor = this.sensor;
        for (var key in sensor) {
            var obj = {};
            obj.name = sensor[key]["name"];
            obj.id = key;
            arr.push(obj);
        }
        return arr;
    }
});
