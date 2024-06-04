const middy = require('@middy/core');
const jsonParser = require('@middy/http-json-body-parser'); // stringify JSON parsing
const httpEventNormalizer = require('@middy/http-event-normalizer'); // prevent nonexistent json etc
const httpErrorHandler = require('@middy/http-error-handler');

const middleware = (handler) => {
  return middy(handler)
    .use(jsonParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
};

module.exports = middleware;