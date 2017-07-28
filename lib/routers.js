Router.route('/', {
    name: 'home',
    template: 'home',
});

Router.route('/tests')
Router.route('/dashboard')
Router.route('/test/:_id',{
  name:"testOverview",
  //  UNLOCK THIS WHEN REMOVING AUTO-PUBLISH
  //  subscriptions: function(){
  //   return Meteor.subscribe('Meta',this.params._id);
  // },
  data: function(){
    return Tests.findOne({"_id":this.params._id});
  },
})

Router.route("/test/:_id/charts",{
  name:"charts",
  // UNLOCK THIS WHEN REMOVING AUTO-PUBLISH
  // subscriptions: function(){
  //   return [Meteor.subscribe('Test',this.params._id),Meteor.subscribe('Meta',this.params._id)];
  // },
  data: function(){
    return Tests.findOne({"_id":this.params._id});
  },
  action: function() {
    if(this.ready()){
      this.render();
    } else {
      this.render('Loading');
    }
  }
});

Router.configure({
    layoutTemplate: 'layout'
});
