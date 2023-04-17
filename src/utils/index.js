const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const RateLimit = require('express-rate-limit').default;  // default import for express-rate-limit

const handleUpload = (storageProvider) => async (req, res) => {
    const upload = multer().single('file');

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Error processing file upload.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file provided.' });
        }

        const publicKey = uuidv4();
        const privateKey = uuidv4();

        try {
            await storageProvider.saveFile(req.file, publicKey, privateKey);

            res.status(201).json({ publicKey, privateKey });
        } catch (error) {
            console.error('Error uploading file:', error);

            res.status(500).json({ error: 'Error uploading file.' });
        }
    });
};

const handleDownload = (storageProvider) => async (req, res) => {
    try {
        const { publicKey } = req.params;
        const file = await storageProvider.getFileStream(publicKey);

        if (!file) {
            return res.status(404).json({ error: 'File not found.' });
        }

        res.setHeader('Content-Type', file.contentType);
        file.stream.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);

        res.status(500).json({ error: 'Error downloading file.' });
    }
};

const handleDelete = (storageProvider) => async (req, res) => {
    try {
        const { privateKey } = req.params;
        const result = await storageProvider.deleteFile(privateKey);

        if (!result) {
            return res.status(404).json({ error: 'File not found.' });
        }

        res.json({ message: 'File deleted successfully.' });
    } catch (error) {
        console.error('Error deleting file:', error);

        res.status(500).json({ error: 'Error deleting file.' });
    }
};

const createRateLimiter = (limit) => {
    const rateLimiterMiddleware = RateLimit({
        windowMs: 24 * 60 * 60 * 1000,
        max: limit,
        message: 'Rate limit exceeded. Please try again later.',
    });

    return (req, res, next) => rateLimiterMiddleware(req, res, next);
};

module.exports = { handleUpload, handleDownload, handleDelete, createRateLimiter };
