const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3000,
    FOLDER: process.env.FOLDER,
    PROVIDER: process.env.PROVIDER || 'local',
    CONFIG: process.env.CONFIG,
    DOWNLOAD_LIMIT: process.env.DOWNLOAD_LIMIT || 100,
    UPLOAD_LIMIT: process.env.UPLOAD_LIMIT || 100,
    FILE_INACTIVITY_TIME: process.env.FILE_INACTIVITY_TIME || 86400000
};
