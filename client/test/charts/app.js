Template.charts.rendered = function() {

  const id = Router.current().params._id;
  const sampleRate = Number(Tests.findOne(id).meta["Sample Rate"]);
  let initialData = ["Brake_Press_af", "TPS", "Velocidad Delante"]

  Meteor.call('getData', id, initialData, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      plotIt(result, initialData, sampleRate);
    }
  })

};
