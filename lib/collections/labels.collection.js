import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

Schemas = {};

// Template.registerHelper('Schemas', Schemas);

Schemas.Item = new SimpleSchema({
  name: {
    type: String,
  },
  friendlyName: {
    type: String,
    optional: true
  }
}, { tracker: Tracker });

var Collections = {};

// Template.registerHelper('Collections', Collections);

Labels = Collections.Labels = new Mongo.Collection('Labels');
Labels.attachSchema(Schemas.Item);

if (Meteor.isServer) {

  Meteor.publish('Labels', function () {
    return Labels.find();
  });

  Labels.allow({
    update() {
      return true;
    }
  });

}
