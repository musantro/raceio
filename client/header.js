Template.header.helpers({
    leftmenu: [{ name: "Dashboard" }, { name: "Analytics" }],
    rightmenu: [{ name: "Contact"}]
})

Template.header.events({
    "click .button-collapse": function(event, template) {
        template.$(".button-collapse").sideNav({
            closeOnClick: true
        });
    }
})
