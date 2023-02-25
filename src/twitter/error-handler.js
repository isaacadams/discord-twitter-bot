module.exports = {
  error: (err, response, requestBody) => {
    if (!response) return { error: err };

    return {
      error: !!err ? err : 'request failed',
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
      endpoint: `POST ${response.url}`,
      requestBody: requestBody && JSON.stringify(requestBody),
      responseBody: response.headers['content-type'].includes(
        'application/json'
      )
        ? JSON.stringify(response.body, null, 2)
        : response.body.toString(),
    };
  },
};
