const needle = require('needle');
const { error } = require('./error-handler');
const { headers } = require('./headers');

/**
 * https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule
 */

const url = 'https://api.twitter.com/2/tweets/search/stream/rules';

module.exports = {
  get: () => {
    return new Promise((res, rej) => {
      needle.get(
        url,
        {
          headers: Object.fromEntries(headers.entries()),
        },
        function (err, response) {
          if (err) {
            rej(error(err, response));
          } else {
            if (response.statusCode === 200) {
              res(response.body);
            } else {
              rej(error(err, response));
            }
          }
        }
      );
    });
  },

  configure: (configuration) => {
    headers.append('Content-Type', 'application/json');
    return new Promise((res, rej) => {
      needle.post(
        url,
        JSON.stringify(configuration),
        {
          headers: Object.fromEntries(headers.entries()),
        },
        function (err, response) {
          if (err) {
            rej(error(err, response));
          } else {
            if (
              (!!configuration['add'] && response.statusCode === 201) ||
              (!!configuration['delete'] && response.statusCode === 200)
            ) {
              res(response.body);
            } else {
              rej(error(err, response));
            }
          }
        }
      );
    }).catch((e) => {
      console.error(e);
      throw e;
    });
  },
};
