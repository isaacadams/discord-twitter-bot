const rules = require('../twitter/rules');
const user = require('../twitter/user');
const userRepo = require('./user.repo');

module.exports = {
  /**
   * Get the list of users configured in the twitter stream
   * @returns {{ id: string, name: string, link: string }[]}
   */
  getTwitterUsers: async () => {
    const ids = await userRepo.getAllUserIds();

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

    const ids = await userRepo.getAllUserIds();
    const profileId = profile.data.id;
    if (ids.indexOf(profileId) < 0) {
      console.log('adding ' + profile.data.name + ' to the feed');
      ids.push(profileId);
      userRepo.addUser(profileId);
    } else {
      throw 'already following @' + twitterUsername;
    }

    await _resetRules(ids);

    return true;
  },

  resetRules: async () => {
    const ids = await userRepo.getAllUserIds();
    await _resetRules(ids);
  },
};

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

/* async function syncUsers(twitterIdsInDatabase) {
  const { data } = await rules.get();

  const idsMissingFromDatabase = data.flatMap((d) => {
    const id = parseInt(d.value.slice(5));
    if (twitterIdsInDatabase.include(id)) {
      return [];
    } else {
      return [{ userid: id }];
    }
  });

  TwitterUsers.bulkCreate(idsMissingFromDatabase);
  return 
} */
