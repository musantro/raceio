// Esto es para crear fake text
Template.dashboard.helpers({
  fakeTitle: function() {
    return Fake.sentence(2)
  },
  fakeParagraph: function() {
    return Fake.paragraph(5)
  },
  testCount: function() {
    switch (Tests.find().count()) {
      case 0:
        return "No tests uploaded"
        break;
      case 1:
        return "One test uploaded"
        break;
      default:
        return `${Tests.find().count()} Tests`

    }
    return Tests.find().count()
  }

});


// test
Template.tests.helpers({
  tests: function() {
    return Tests.find({})
  }
});
