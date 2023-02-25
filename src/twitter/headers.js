const { Headers } = require('undici');
const env = require('../env');

const headers = new Headers();
headers.append('Authorization', `Bearer ${env.TWITTER.BEARER}`);

module.exports = {
  headers,
};
