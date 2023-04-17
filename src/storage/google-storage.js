const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

class GoogleCloudStorage {
    constructor(configPath) {
        const config = require(configPath);
        this.storage = new Storage(config);
        this.bucket = this.storage.bucket(config.bucket);
    }

    // Implement the methods required for the storage provider interface
}

module.exports = GoogleCloudStorage;
