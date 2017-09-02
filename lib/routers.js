Router.route('/', {
    name: 'home',
    template: 'home',
});

Router.route('/tests', {
  name:"tests",
  waitOn: function(){
    return Meteor.subscribe('Tests')
  },
  action: function() {
    this.render();
  }
})
Router.route('/dashboard', {
  name:"dashboard",
  waitOn: function(){
    return Meteor.subscribe('Tests')
  },
  action: function() {
    this.render();
  }
})
Router.route('/settings', {
  waitOn: function(){
    return Meteor.subscribe('Labels')
  },
  action: function() {
    this.render();
  }
})
Router.route('/test/:_id',{
  name:"testOverview",
  waitOn: function(){
    return Meteor.subscribe('Meta',this.params._id);
  },
  data: function(){
    return Tests.findOne({"_id":this.params._id});
  },
  action: function() {
    this.render();
  }
})

Router.route("/test/:_id/ellipse", {
  name:"ellipse",
  // waitOn: function(){
  //   return Meteor.subscribe('subEllipse',this.params._id);
  // },
  // data: function(){
  //   return Tests.findOne({"_id":this.params._id});
  // },
  action: function() {
      this.render();
  }
})

Router.route("/test/:_id/charts",{
  name:"charts",
  waitOn: function(){
    return Meteor.subscribe('Meta',this.params._id);
  },
  // data: function(){
  //   return Tests.findOne({"_id":this.params._id});
  // },
  action: function() {
      this.render('charts');
  }
});

Router.route('/loading')

Router.configure({
    loadingTemplate: 'loading',
    layoutTemplate: 'layout'
});
