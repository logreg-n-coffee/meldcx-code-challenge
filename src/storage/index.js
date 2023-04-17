// Import required modules
const config = require('../config');
const LocalStorage = require('./local-storage');
const GoogleCloudStorage = require('./google-cloud-storage');

// Create an instance of the storage provider based on the configuration
let storageProvider;

if (config.PROVIDER === 'google') {
    storageProvider = new GoogleCloudStorage(config.CONFIG);
} else {
    storageProvider = new LocalStorage(config.FOLDER);
}

// Export the storage provider instance
module.exports = storageProvider;
