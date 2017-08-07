Template.settings.onRendered(function() {
  $('select').material_select();

})

var hooksObject = {
  onSuccess: function() {
    if ($('.toast').first()[0] == undefined) {
      Materialize.toast($toastContent, 3000);
    }
  }
};
var $toastContent = $('<span>Settings saved</span>');
var formIds = Labels.find().map(function(item) {
  return "settings-" + item._id;
});
AutoForm.addHooks(null, hooksObject);
