// Import required modules
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Export the configuration object
module.exports = {
    PORT: process.env.PORT || 3000,
    FOLDER: process.env.FOLDER || './files',
    PROVIDER: process.env.PROVIDER || 'local',
    CONFIG: process.env.CONFIG || './provider-config.json',
    UPLOAD_LIMIT_PER_IP: process.env.UPLOAD_LIMIT_PER_IP || 100,  // UPLOAD_LIMIT_PER_IP: The maximum number of file uploads allowed per IP address per minute (default: 10)
    DOWNLOAD_LIMIT_PER_IP: process.env.DOWNLOAD_LIMIT_PER_IP || 100,  // DOWNLOAD_LIMIT_PER_IP: The maximum number of file downloads allowed per IP address per minute (default: 100)
    CLEANUP_INTERVAL: process.env.CLEANUP_INTERVAL || 86400000,
};
