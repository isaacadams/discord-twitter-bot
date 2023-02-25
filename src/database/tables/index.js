const { Tags } = require('./tags');

module.exports = {
  sync: () => {
    const promises = [Tags].map((m) => m.sync());
    return Promise.all(promises);
  },
};
