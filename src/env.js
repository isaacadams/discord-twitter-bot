require('dotenv').config();

const name =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  name,
  isProduction: name === 'production',
  TWITTER: {
    BEARER: process.env.TWITTER_BEARER,
  },
  DISCORD: {
    SECRET: process.env.DISCORD_SECRET,
  },
};
