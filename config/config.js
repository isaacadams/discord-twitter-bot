const fs = require('node:fs');
const path = require('node:path');

const pathToDatabase = path.resolve(__dirname, '..', 'database.sqlite');

module.exports = {
  development: {
    host: 'localhost',
    dialect: 'sqlite',
    storage: pathToDatabase,
    logging: true,
  },
  production: {
    host: 'localhost',
    dialect: 'sqlite',
    storage: pathToDatabase,
  },
};
