module.exports = {
  error: (err, response) => {
    return {
      error: !!err ? err : 'request failed',
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
      endpoint: `POST ${url}`,
      requestBody: JSON.stringify(configuration),
      responseBody: response.headers['content-type'].includes(
        'application/json'
      )
        ? JSON.stringify(response.body, null, 2)
        : response.body.toString(),
    };
  },
};
