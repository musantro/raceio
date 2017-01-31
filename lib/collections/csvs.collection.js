this.Csvs = new Meteor.Files({
    // debug: true,
    collectionName: 'Csvs',
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload: function(file) {
        // Allow upload files under 2GB, and only in csv formats
        if (file.size <= 2 * 1024 * 1024 * 1024 && /csv/i.test(file.ext)) {
            return true;
        } else {
            return 'Please upload CSV file, with size equal or less than 2GB';
        }
    }
});
