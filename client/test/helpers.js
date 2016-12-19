// Esto es para preparar el dropdown de sensores
Template.test.helpers({
    sensors: function() {
      return Sensors.find()
    },
});
