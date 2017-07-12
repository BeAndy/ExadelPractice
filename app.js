const express = require('express');
const metaData = require('./server/routes/meta-data.js');

const app = express();

app.use('/api/meta-data/', metaData);

app.listen(1337);
