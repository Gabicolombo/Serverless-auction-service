const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonParser = require('@middy/http-json-body-parser'); // stringify JSON parsing
const httpEventNormalizer = require('@middy/http-event-normalizer'); // prevent nonexistent json etc
const httpErrorHandler = require('@middy/http-error-handler'); 
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {

  try{
    let auctions;

    const result = await dynamodb.scan({ TableName: process.env.AUCTIONS_TABLE_NAME}).promise();

    auctions = result.Items;
    return {
      statusCode: 201,
      body: JSON.stringify(auctions),
    };

  }catch(err){
    console.error(err);
    throw new createError.InternalServerError(err);
  }
}

module.exports.handler = middy(getAuctions)
                        .use(jsonParser())
                        .use(httpEventNormalizer())
                        .use(httpErrorHandler());
