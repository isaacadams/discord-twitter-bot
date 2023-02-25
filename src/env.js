require('dotenv').config();

module.exports = {
  TWITTER: {
    BEARER: process.env.TWITTER_BEARER,
  },
  DISCORD: {
    SECRET: process.env.DISCORD_SECRET,
  },
};
