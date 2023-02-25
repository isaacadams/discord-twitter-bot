const { EventEmitter } = require('node:events');
const needle = require('needle');
const { headers } = require('./headers');

(async () => {
  connect();
})();

const tweets = new EventEmitter();

tweets.addListener('error', (e) => console.error(e));

function connect() {
  try {
    headers.append('User-Agent', 'v2SampleStreamJS');
    const stream = needle.get(
      'https://api.twitter.com/2/tweets/search/stream',
      {
        headers: Object.fromEntries(headers.entries()),
        timeout: 20000,
      }
    );

    stream
      .on('data', (data) => {
        try {
          const json = parseBuffer(data);

          if (json === undefined) return;

          if (!!json['connection_issue']) {
            tweets.emit('error', {
              kind: 'connection_issue',
              data: json,
            });
            /* reconnect(stream, socket, token); */
          } else {
            if (json.data) {
              tweets.emit('tweet', json);
            } else {
              tweets.emit('error', {
                kind: 'authentication',
                data: json,
              });
            }
          }
        } catch (e) {
          console.error(e);
          tweets.emit('error', {
            kind: 'unknown',
            error: e,
            data: data,
          });
        }
      })
      .on('error', (error) => {
        tweets.emit('error', {
          kind: 'unknown',
          error,
          data: data,
        });

        /* reconnect(stream, socket, token); */
      });
  } catch (e) {
    tweets.emit('error', {
      kind: 'unknown',
      error: e,
      data: data,
    });
  }
}

/**
 * @param {Buffer} buffer
 * @returns {String | undefined}
 */
function parseBuffer(buffer) {
  if (buffer.length === 2 && buffer[0] === 13 && buffer[1] === 10) {
    // then it is '/r/n' and can be ignored
    console.info('ignoring newline');
    return undefined;
  }

  try {
    return JSON.parse(buffer);
  } catch {
    console.error(`failed to parse buffer: `, buffer);
    return undefined;
  }
}

function getRules() {
  http_client
    .get('https://api.twitter.com/2/tweets/search/stream/rules')
    .then((r) => r.data)
    .then(console.log);
}

module.exports = {
  tweet$: {
    subscribe: (handler) => {
      return subscribe('tweet', (t) => handler(transformTweet(t)));
    },
  },
  error$: {
    subscribe: (handler) => {
      return subscribe('error', handler);
    },
  },
};

function subscribe(name, handler) {
  tweets.addListener(name, handler);
  return () => {
    tweets.removeListener(name, handler);
  };
}

function transformTweet(tweet) {
  return {
    id: tweet.data.id,
    link: linkToTweet(tweet.data.id),
    content: tweet.data.text,
  };
}

function linkToTweet(id) {
  return `https://twitter.com/w/status/${id}`;
}
