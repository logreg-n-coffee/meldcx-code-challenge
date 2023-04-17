const config = require('../config');
const LocalStorage = require('./local-storage');
const GoogleCloudStorage = require('./google-cloud-storage');

let storageProvider;
if (config.PROVIDER === 'google') {
    storageProvider = new GoogleCloudStorage(config.CONFIG);
} else {
    storageProvider = new LocalStorage(config.FOLDER);
}

module.exports = storageProvider;
