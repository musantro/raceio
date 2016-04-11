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
  template:"testSingle",
  data:function(){
    testObject = Tests.findOne(this.params._id);
    return testObject;
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
