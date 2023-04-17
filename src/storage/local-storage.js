// Import required modules
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Define LocalStorage class
class LocalStorage {
    // Constructor function
    constructor(rootFolder) {
        // Set root folder for storage
        this.rootFolder = rootFolder;
    }

    // Save file function
    async saveFile(file, publicKey, privateKey) {
        // Set file path
        const filePath = path.join(this.rootFolder, publicKey);

        // Write file buffer to disk
        await fs.promises.writeFile(filePath, file.buffer);

        // Define metadata object
        const metadata = {
            privateKey,
            contentType: file.mimetype,
            lastAccessed: Date.now(),
        };

        // Write metadata object to disk
        await fs.promises.writeFile(filePath + '.meta', JSON.stringify(metadata));
    }

    // Get file stream function
    async getFileStream(publicKey) {
        // Set file path
        const filePath = path.join(this.rootFolder, publicKey);

        try {
            // Read metadata from disk
            const metadata = JSON.parse(await fs.promises.readFile(filePath + '.meta', 'utf8'));

            // Update lastAccessed property in metadata
            metadata.lastAccessed = Date.now();

            // Write updated metadata to disk
            await fs.promises.writeFile(filePath + '.meta', JSON.stringify(metadata));

            // Return file stream and content type
            return {
                stream: fs.createReadStream(filePath),
                contentType: metadata.contentType,
            };
        } catch (error) {
            // If file not found, return null
            if (error.code === 'ENOENT') {
                return null;
            }

            // Otherwise, throw error
            throw error;
        }
    }

    // Delete file function
    async deleteFile(privateKey) {
        // Read files in root folder
        const files = await fs.promises.readdir(this.rootFolder);

        // Loop through files
        for (const file of files) {
            // Check if file is a metadata file
            if (file.endsWith('.meta')) {
                // Set metadata file path
                const metadataPath = path.join(this.rootFolder, file);

                // Read metadata from disk
                const metadata = JSON.parse(await fs.promises.readFile(metadataPath, 'utf8'));

                // Check if metadata.privateKey matches input privateKey
                if (metadata.privateKey === privateKey) {
                    // Set file path
                    const filePath = path.join(this.rootFolder, file.replace('.meta', ''));

                    // Delete file and metadata from disk
                    await fs.promises.unlink(filePath);
                    await fs.promises.unlink(metadataPath);

                    // Return true if file is deleted
                    return true;
                }
            }
        }

        // Return false if file is not found
        return false;
    }

    // Method to clean up the local storage by deleting files that have not been accessed within a certain time
    async cleanup(maxAge) {
        // Read all the files in the root folder
        const files = await fs.promises.readdir(this.rootFolder);

        // Loop through each file
        for (const file of files) {
            // If the file has a .meta extension, read the metadata
            if (file.endsWith('.meta')) {
                const metadataPath = path.join(this.rootFolder, file);
                const metadata = JSON.parse(await fs.promises.readFile(metadataPath, 'utf8'));

                // If the file has not been accessed within the maximum age, delete the file and the metadata
                if (Date.now() - metadata.lastAccessed > maxAge) {
                    const filePath = path.join(this.rootFolder, file.replace('.meta', ''));

                    await fs.promises.unlink(filePath);
                    await fs.promises.unlink(metadataPath);
                }
            }
        }
    }
}

module.exports = LocalStorage;
