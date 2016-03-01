Template.header.helpers({
    leftmenu: [{ name: "Dashboard" }, { name: "Analytics" }],
    rightmenu: [{ name: "Contact"}]
});

Template.upload.helpers({
    uploading() {
        return Template.instance().uploading.get();
    }
});

Template.dashboard.helpers({
	fakeTitle: function() {
		return Fake.sentence(2)
	},
	fakeParagraph: function() {
		return Fake.paragraph(5)
	}
})