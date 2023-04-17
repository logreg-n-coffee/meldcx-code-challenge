// Import Jest functions for testing (optional, only needed if not using the global Jest environment)
const { describe, expect, test, afterAll } = require('@jest/globals');

// Import necessary modules
const path = require('path'); // Node.js path module for handling file paths
const fs = require('fs'); // Node.js file system module for file I/O
const LocalStorage = require('../../../src/storage/local-storage'); // Import LocalStorage class from the given path
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from the uuid module for generating unique IDs

// Set the storage path for test files
const storagePath = path.join(__dirname, '../../.', 'files');

// Implement the tests for the methods in the LocalStorage class
// Use 'describe' to group tests related to the Local Storage Provider
describe('Local Storage Provider', () => {
    // Create an instance of the LocalStorage class with the specified storage path
    const storageProvider = new LocalStorage(storagePath);
    let publicKey = ''; // Initialize the public key variable
    let privateKey = ''; // Initialize the private key variable

    // Test the 'saveFile' method of the LocalStorage class
    test('saveFile', async () => {
        const fileContent = 'Sample file content'; // Define sample file content
        const fileBuffer = Buffer.from(fileContent); // Convert the file content to a buffer
        const mimeType = 'text/plain'; // Define the MIME type for the test file
        publicKey = uuidv4(); // Generate a unique public key using uuidv4
        privateKey = uuidv4(); // Generate a unique private key using uuidv4
        const file = {
            buffer: fileBuffer,
            mimetype: mimeType,
        };

        // Call the 'saveFile' method of the storageProvider with the test file, public key, and private key
        await storageProvider.saveFile(file, publicKey, privateKey);

        // Check if the file was saved successfully by verifying its existence on the file system
        const savedFilePath = path.join(storagePath, publicKey);
        expect(fs.existsSync(savedFilePath)).toBe(true);

        // Read the saved file content and compare it with the original file content
        const savedFileContent = await fs.promises.readFile(savedFilePath);
        expect(savedFileContent.toString()).toBe(fileContent);
    });

    // Test the 'getFileStream' method of the LocalStorage class
    test('getFileStream', async () => {
        // Call the 'getFileStream' method of the storageProvider with the public key
        const fileStreamObject = await storageProvider.getFileStream(publicKey);
        const fileStream = fileStreamObject.stream;

        // Collect the chunks of the file stream into an array
        const chunks = [];
        for await (const chunk of fileStream) {
            chunks.push(chunk);
        }

        // Concatenate the chunks and convert them to a string
        const fileContent = Buffer.concat(chunks).toString();

        // Compare the resulting file content with the expected content
        expect(fileContent).toBe('Sample file content');
    });

    // Test the 'deleteFile' method of the LocalStorage class
    test('deleteFile', async () => {
        // Call the 'deleteFile' method of the storageProvider with the private key
        const response = await storageProvider.deleteFile(privateKey);

        // Check if the deleteFile method returned true, indicating successful deletion
        expect(response).toBe(true);

        // Verify that the file no longer exists on the file system after deletion
        const savedFilePath = path.join(storagePath, publicKey);
        expect(fs.existsSync(savedFilePath)).toBe(false);
    });
});
