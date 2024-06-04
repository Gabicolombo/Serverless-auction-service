const AWS = require('aws-sdk');
const middleware = require('../lib/common');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {

  try{
    let auction;
    const { id } = event.pathParameters;
   
    const result = await dynamodb.get({ 
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id }
    }).promise();
   
    auction = result.Item;

    if(!auction) throw new createError.NotFound(`Auction with ID ${id} not found!`);

    return {
      statusCode: 201,
      body: JSON.stringify(auction),
    };

  }catch(err){
    console.error(err);
    throw new createError.InternalServerError(err);
  }
}

module.exports.handler = middleware(getAuction);