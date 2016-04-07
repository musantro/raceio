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