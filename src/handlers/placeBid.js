const AWS = require('aws-sdk');
const middleware = require('../lib/common');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {

  try {
    let auction;
    const { id } = event.pathParameters;
    const { amount } = event.body; // Ensure body is parsed
    console.log(`id: ${id}, amount: ${amount}`);

    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount',
      ExpressionAttributeValues: {
        ':amount': amount
      },
      ReturnValues: 'ALL_NEW',
    };
  
    let updatedAuction;
  
    try {
      const result = await dynamodb.update(params).promise();
      updatedAuction = result.Attributes;
    } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };

  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }
}

module.exports.handler = middleware(placeBid);