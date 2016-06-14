// Esto es para crear fake text
Template.dashboard.helpers({
    fakeTitle: function() {
        return Fake.sentence(2)
    },
    fakeParagraph: function() {
        return Fake.paragraph(5)
    },
    numTests: function() {
        return Tests.find().count()
    }

});
