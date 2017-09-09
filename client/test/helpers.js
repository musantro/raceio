Template.testOverview.helpers({
  alarmsAreNotSet: function() {
    return (Labels.find({
      isAlert: "yes"
    }).count() == 0) ? true : false
  },
  exceeded: function() {
    const id = Router.current().params._id;

    Meteor.call('checkAlarms', id, function(error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    })
  }
})
