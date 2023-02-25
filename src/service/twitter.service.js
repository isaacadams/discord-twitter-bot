const getUserByIds = require('../twitter/getUserByIds');
const rules = require('../twitter/rules');
const { TwitterUsers } = require('../database').tables;

module.exports = {
  /**
   * Get the list of users configured in the twitter stream
   * @returns {{ id: string, name: string, link: string }[]}
   */
  getTwitterUsers: async () => {
    const ids = await getAllUserIds();

    const users = await getUserByIds(...ids).catch(console.error);

    return users.data.map((d) => ({
      id: d.id,
      name: d.name,
      link: `https://twitter.com/${d.username}`,
    }));
  },

  followUser: async (id) => {
    const ids = await getAllUserIds();
    if (ids.indexOf(id) < 0) {
      ids.push(id);
      TwitterUsers.create({ userid: id }).catch(console.error);
    }

    await _resetRules(ids);
  },

  resetRules: async () => {
    const ids = await getAllUserIds();
    await _resetRules(ids);
  },
};

/**
 *
 * @returns {number[]}
 */
async function getAllUserIds() {
  return (
    await TwitterUsers.findAll({ attributes: ['userid'] }).catch(console.error)
  ).map((r) => r.userid);
}

async function generateDeleteAll() {
  try {
    const { data } = await rules.get();
    return {
      delete: {
        ids: (data ?? []).map((r) => r.id),
      },
    };
  } catch {
    return {
      delete: {
        ids: [],
      },
    };
  }
}

function generateFollowAll(...ids) {
  return {
    add: ids.map((i) => ({ value: 'from:' + i, tag: 'follows-user' })),
  };
}

async function _resetRules(twitterUserIds) {
  const [rulesToDelete, followResponse] = await Promise.all([
    generateDeleteAll(),
    rules.configure(generateFollowAll(...twitterUserIds)),
  ]);

  let idsToDelete = filterOutDuplicateRules(
    rulesToDelete.delete.ids,
    followResponse.errors
  );
  console.log(idsToDelete);

  if (idsToDelete.length > 0) {
    rules.configure({ delete: { ids: idsToDelete } });
  }
}

function filterOutDuplicateRules(idsToDelete, errors) {
  const instructions = new Map((errors ?? []).map((e) => [e.id, e.title]));
  if (instructions.size < 1) return idsToDelete;

  return idsToDelete.flatMap((i) => {
    const found = instructions.get(i);
    if (found != undefined && found === 'DuplicateRule') {
      console.info('found a duplicate rule');
      return [];
    } else {
      return [i];
    }
  });
}
