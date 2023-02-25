const { orm } = require('./client');

module.exports = {
  sync: async () => {
    console.log(`syncing orm`);
    await orm.sync();
    console.log(`sync success!`);
  },
  tables: require('./tables'),
};
