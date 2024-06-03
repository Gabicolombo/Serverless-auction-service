const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonParser = require('@middy/http-json-body-parser'); // stringify JSON parsing
const httpEventNormalizer = require('@middy/http-event-normalizer'); // prevent nonexistent json etc
const httpErrorHandler = require('@middy/http-error-handler'); 
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const { title } = event.body;

  const auction = {
    id: uuid(),
    title,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  try{
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise();
  }catch(err){
    console.error(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

module.exports.handler = middy(createAuction)
                        .use(jsonParser())
                        .use(httpEventNormalizer())
                        .use(httpErrorHandler());
