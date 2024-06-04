const AWS = require('aws-sdk');
const middleware = require('../lib/common');
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

module.exports.handler = middleware(getAuctions);
