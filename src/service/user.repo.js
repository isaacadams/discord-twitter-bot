const { TwitterUsers } = require('../database/tables');

module.exports = {
  /**
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  addUser: (id) => {
    return TwitterUsers.create({ userid: id }).catch((e) => {
      console.error(e);
      return false;
    });
  },

  /**
   *
   * @returns {number[]}
   */
  getAllUserIds: async () => {
    return (
      await TwitterUsers.findAll({ attributes: ['userid'] }).catch(
        console.error
      )
    ).map((r) => r.userid);
  },
};
