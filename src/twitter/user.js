//

const needle = require('needle');
const { error } = require('./error-handler');
const { headers } = require('./headers');

module.exports = {
  getByUsername: (username, fields) => {
    fields ??= ['id'];
    return new Promise((res, rej) => {
      needle.get(
        `https://api.twitter.com/2/users/by/username/${username}?user.fields=${fields.join(
          ','
        )}`,
        {
          headers: Object.fromEntries(headers.entries()),
        },
        function (err, data) {
          if (err) {
            rej(error(err, response));
          } else {
            if (data.statusCode === 200) {
              res(data.body);
            } else {
              rej(error(err, response));
            }
          }
        }
      );
    });
  },
  getByIds: (...ids) => {
    return new Promise((res, rej) => {
      needle.get(
        `https://api.twitter.com/2/users?ids=${ids.join(',')}`,
        {
          headers: Object.fromEntries(headers.entries()),
        },
        function (err, data) {
          if (err) {
            rej(error(err, response));
          } else {
            if (data.statusCode === 200) {
              res(data.body);
            } else {
              rej(error(err, response));
            }
          }
        }
      );
    });
  },
};
