const express = require('express');
const storageProvider = require('../storage');
const { handleUpload, handleDownload, handleDelete } = require('../utils');

const router = express.Router();

router.post('/files', handleUpload(storageProvider));
router.get('/files/:publicKey', handleDownload(storageProvider));
router.delete('/files/:privateKey', handleDelete(storageProvider));

module.exports = router;
