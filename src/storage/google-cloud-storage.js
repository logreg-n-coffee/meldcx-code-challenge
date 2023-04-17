const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

class GoogleCloudStorage {
    constructor(configPath) {
        this.storage = new Storage({ keyFilename: configPath });
        this.config = require(configPath);
        this.bucket = this.storage.bucket(this.config.bucketName);
    }

    async saveFile(file, publicKey, privateKey) {
        const fileObject = this.bucket.file(publicKey);

        await fileObject.save(file.buffer, { contentType: file.mimetype });

        const metadata = {
            privateKey,
            contentType: file.mimetype,
            lastAccessed: Date.now(),
        };

        await this.bucket.file(publicKey + '.meta').save(JSON.stringify(metadata));
    }

    async getFileStream(publicKey) {
        const fileObject = this.bucket.file(publicKey);
        const metadataObject = this.bucket.file(publicKey + '.meta');

        try {
            const [metadata] = await metadataObject.download();

            const parsedMetadata = JSON.parse(metadata.toString());

            parsedMetadata.lastAccessed = Date.now();
            await metadataObject.save(JSON.stringify(parsedMetadata));

            return {
                stream: fileObject.createReadStream(),
                contentType: parsedMetadata.contentType,
            };
        } catch (error) {
            if (error.code === 404) {
                return null;
            }

            throw error;
        }
    }

    async deleteFile(privateKey) {
        const [files] = await this.bucket.getFiles({ prefix: '' });

        for (const file of files) {
            if (file.name.endsWith('.meta')) {
                const [metadata] = await file.download();
                const parsedMetadata = JSON.parse(metadata.toString());

                if (parsedMetadata.privateKey === privateKey) {
                    const fileObject = this.bucket.file(file.name.replace('.meta', ''));

                    await fileObject.delete();
                    await file.delete();

                    return true;
                }
            }
        }

        return false;
    }

    async cleanup(maxAge) {
        const [files] = await this.bucket.getFiles({ prefix: '' });

        for (const file of files) {
            if (file.name.endsWith('.meta')) {
                const [metadata] = await file.download();
                const parsedMetadata = JSON.parse(metadata.toString());

                if (Date.now() - parsedMetadata.lastAccessed > maxAge) {
                    const fileObject = this.bucket.file(file.name.replace('.meta', ''));

                    await fileObject.delete();
                    await file.delete();
                }
            }
        }
    }
}

module.exports = GoogleCloudStorage;
