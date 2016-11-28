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
  data:function(){
    testData = Sensors.find({"fromTest":this.params._id}).fetch(); // Browser does not fetch testData...
    // console.log(testData);
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
