// Esto es para preparar el dropdown de sensores
Template.charts.helpers({
    sensors: function() {
      const id = Router.current().params._id;
      return Tests.findOne(id).sensors
    }
});
