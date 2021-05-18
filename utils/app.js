require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cookie-parser')());


app.use('/api/v1/Users', require('../routes/userRoutes'));
app.use('/api/v1/Goal', require('../routes/goalRoutes'));

app.use(require('../middleware/not-found'));
app.use(require('../middleware/error'));

module.exports = app;
