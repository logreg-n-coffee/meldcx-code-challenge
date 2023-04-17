const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class LocalStorage {
    constructor(rootFolder) {
        this.rootFolder = rootFolder;
    }

    // Implement the methods required for the storage provider interface
}

module.exports = LocalStorage;
