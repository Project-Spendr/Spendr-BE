require('dotenv').config();
require('./utils/connect')();

const mongoose = require('mongoose');
const seed = require('./utils/seed');

seed()
  .then(() => console.log('Database Seeded'))
  .finally(() => mongoose.connection.close());