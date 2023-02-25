/* const Database = require('better-sqlite3');
const db = new Database('foobar.db', { verbose: console.log }); */
const Keyv = require('keyv');
const config = require('./config');

// One of the following
const db = new Keyv('sqlite://' + config.pathToDatabase);

db.set('test', 1234);

const twitterFeedChannel = kv('twitterFeedChannel');

function kv(name) {
  return {
    get: () => db.get(name),
    set: (value) => {
      return db.set(name, value);
    },
  };
}

module.exports = {
  twitterFeedChannel,
};
