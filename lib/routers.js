Router.route('/', {
    name: 'home',
    template: 'home',
    layoutTemplate: 'mainLayout'
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
  waitOn: function(){
    return Meteor.subscribe('Test',this.params_id);
  },
});

Router.configure({
    path: '/layouts/',
    layoutTemplate: 'layout'
});

Router.configure({
    path: '/layouts/',
    layoutTemplate: 'mainLayout'
})
