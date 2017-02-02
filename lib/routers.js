Router.route('/', {
    name: 'home',
    template: 'home',
    layoutTemplate: 'layout'
});

Router.route('/dashboard', {
    path: '/dashboard/',
    template: 'dashboard',
    layoutTemplate: 'layout'
});

Router.route('/tests', {
    template: 'tests',
    layoutTemplate: 'layout'
});

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
    path: '/layouts/',
    layoutTemplate: 'layout'
});

Router.configure({
    path: '/layouts/',
    layoutTemplate: 'mainLayout'
})
