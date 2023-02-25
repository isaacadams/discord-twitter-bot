const rules = require('../twitter/rules');
const user = require('../twitter/user');
const { TwitterUsers } = require('../database').tables;

module.exports = {
  /**
   * Get the list of users configured in the twitter stream
   * @returns {{ id: string, name: string, link: string }[]}
   */
  getTwitterUsers: async () => {
    const ids = await getAllUserIds();
    if (ids.length < 1) return [];
    const users = await user.getByIds(...ids).catch(console.error);

    return users.data.map((d) => ({
      id: d.id,
      name: d.name,
      link: `https://twitter.com/${d.username}`,
    }));
  },

  followUser: async (twitterUsername) => {
    const profile = await user
      .getByUsername(twitterUsername, ['id', 'name'])
      .catch((e) => {
        console.error(e);
        return undefined;
      });

    if (profile === undefined) {
      throw 'could not find @' + twitterUsername;
    }

    const ids = await getAllUserIds();
    const profileId = parseInt(profile.data.id);
    if (ids.indexOf(profileId) < 0) {
      console.log('adding ' + profile.data.name + ' to the feed');
      ids.push(profileId);
      TwitterUsers.create({ userid: profileId }).catch(console.error);
    } else {
      throw 'already following @' + twitterUsername;
    }

    await _resetRules(ids);

    return true;
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
