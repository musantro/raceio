// Esto define el menú
Template.header.helpers({
    leftmenu: [{ name: "Dashboard"}, { name: "Report" }, { name: "History" }],
    rightmenu: [{ name: "My Account" }, { name: "Logout" }]
});
// Esto establece si se está subiendo algo o no
Template.upload.helpers({
    uploading() {
        return Template.instance().uploading.get();
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

Template.registerHelper("objectToPairs", function(object){
    return _.map(object, function(value, key) {
        return {
            key: key,
            value: value
        };
    });
});


Template.testSingle.helpers({
tag: function () {
    var arr = [], sensor = this.sensor;
    for (var key in sensor) {
        var obj = {};
        obj.name = sensor[key]["name"];
        arr.push(obj);
    }
    return arr;
  }
});
