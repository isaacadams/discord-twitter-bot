//

const needle = require('needle');
const { headers } = require('./headers');

module.exports = function (...ids) {
  return new Promise((res, rej) => {
    needle.get(
      `https://api.twitter.com/2/users?ids=${ids.join(',')}`,
      {
        headers: Object.fromEntries(headers.entries()),
      },
      function (err, data) {
        if (err) {
          rej(err);
          return;
        } else {
          if (data.statusCode === 200) {
            res(data.body);
          } else {
            rej({
              statusCode: data.statusCode,
              statusMessage: data.statusMessage,
              error: data.body,
            });
          }
        }
      }
    );
  });
};
