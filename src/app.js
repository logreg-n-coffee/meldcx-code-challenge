const express = require('express');
const config = require('./config');
const apiRoutes = require('./api');

const app = express();

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
});
