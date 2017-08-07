Template["settings"].helpers({
  labels() {
    return Labels.find({}, {
      sort: {
        name: 1
      }
    });
  },
  makeUniqueID() {
    return `settings-${this._id}`;
  }
});
