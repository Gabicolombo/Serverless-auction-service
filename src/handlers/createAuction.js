const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const { title } = JSON.parse(event.body);

  const auction = {
    id: uuid(),
    title,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: 'AuctionsTable',
    Item: auction
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

module.exports.handler = createAuction;
