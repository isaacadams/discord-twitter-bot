const getUserByIds = require('../twitter/getUserByIds');
const { TwitterUsers } = require('../database').tables;

module.exports = {
  /**
   * Get the list of users configured in the twitter stream
   * @returns {{ id: string, name: string, link: string }[]}
   */
  getTwitterUsers: async () => {
    const ids = (
      await TwitterUsers.findAll({ attributes: ['userid'] }).catch(
        console.error
      )
    ).map((r) => r.userid);

    const users = await getUserByIds(...ids).catch(console.error);

    return users.data.map((d) => ({
      id: d.id,
      name: d.name,
      link: `https://twitter.com/${d.username}`,
    }));
  },
};
