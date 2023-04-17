// Import required modules
const express = require('express');
const config = require('../config');
const storageProvider = require('../storage');
const { handleUpload, handleDownload, handleDelete, createRateLimiter } = require('../utils');

// Create an Express Router
const router = express.Router();

// Define the API routes and their corresponding handlers
router.post('/files', createRateLimiter(config.UPLOAD_LIMIT_PER_IP), handleUpload(storageProvider));
router.get('/files/:publicKey', createRateLimiter(config.DOWNLOAD_LIMIT_PER_IP), handleDownload(storageProvider));
router.delete('/files/:privateKey', handleDelete(storageProvider));

// Export the router
module.exports = router;
