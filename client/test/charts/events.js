Template.charts.onRendered(function() {
  $('select').material_select();
})

Template.charts.events({
  "change #select-sensors": function(event, template) {
    const id = Router.current().params._id;
    const sampleRate = Number(Tests.findOne(id).meta["Sample Rate"]);

    let sensors = template.$('#select-sensors').val(); // devuelve Arr de strings
    let isFilter = template.$('#mySwitch').prop('checked');

    if (sensors.length > 3) {
      Materialize.toast(`You've selected ${sensors.length} sensors. Only 3 permitted`, 3000)
    } else {
      Meteor.call('getData', id, sensors, isFilter, function(error, result) {
        if (error) {
          console.error(error);
        } else {
          plotIt(result, sensors, sampleRate);
        }
      })
    }
  },
  "change #mySwitch": function(event, template) {
    const id = Router.current().params._id;
    const sampleRate = Number(Tests.findOne(id).meta["Sample Rate"]);

    let filter = template.$('#mySwitch')
    let sensors = template.$('#select-sensors').val() // devuelve Arr de strings

    filter.prop('checked') ? filter.prop('checked', false) : filter.prop('checked', true)

    if (sensors.length > 3) {
      Materialize.toast(`You've selected ${sensors.length} sensors. Only 3 permitted`, 3000)
    } else {
      Meteor.call('getData', id, sensors, filter.prop('checked'), function(error, result) {
        if (error) {
          console.error(error);
        } else {
          plotIt(result, sensors, sampleRate);
        }
      })
    }

  }
})
