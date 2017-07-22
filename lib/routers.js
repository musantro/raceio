Router.route('/', {
    name: 'home',
    template: 'home',
});

Router.route('/dashboard')
Router.route('/tests')

Router.route("/test/:_id",{
  name:"test",
  template:"test",
  subscriptions: function(){
    return [Meteor.subscribe('Test',this.params._id),Meteor.subscribe('Meta',this.params._id)];
  },
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
