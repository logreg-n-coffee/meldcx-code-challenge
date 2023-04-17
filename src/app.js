// Import required modules
const express = require('express');
const config = require('./config');
const apiRoutes = require('./api');
const storageProvider = require('./storage');

// Create an Express application
const app = express();

// Use JSON middleware for parsing incoming request bodies
app.use(express.json());

// Use the API routes for all requests starting with '/' (root)
app.use('/', apiRoutes);

// Start the server and listen for incoming requests on the specified port
app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
});

// Schedule the cleanup job
setInterval(async () => {
    await storageProvider.cleanup(config.CLEANUP_INTERVAL);
}, config.CLEANUP_INTERVAL);

// Export app for testing
module.exports = {
    app,
};
