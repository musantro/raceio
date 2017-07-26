// Esto es para preparar el dropdown de sensores
Template.charts.helpers({
    sensors: function() {
      return Sensors.find()
    },
});
