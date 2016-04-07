Template.tests.helpers({
	tests: Tests.find({})
});

Template.dashboard.helpers({
	numTests: Tests.find().count()
})

Template.testSingle.onCreated(function() {
	var self= this;
	self.autorun(function() {
		self.subscribe('tests');
	});
});