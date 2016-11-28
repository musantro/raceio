// Esto es para preparar el dropdown de sensores
Template.test.helpers({
    tag: function() {
        var arr = [],
            sensor = this.sensor;
        for (var key in sensor) {
            var obj = {};
            obj.name = sensor[key]["name"];
            obj.id = key;
            arr.push(obj);
        }
        return arr;
    }
});

Template.test.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('tests');
    });
});

Template.test.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('sensors');
    });
});
