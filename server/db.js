const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  }
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'HangmanPlayers';

async function createPlayer(playerName) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      playerName,
      wins: 0,
      losses: 0
    }
  };
  await docClient.send(new PutCommand(params));
  return params.Item;
}

async function getPlayer(playerName) {
  const params = {
    TableName: TABLE_NAME,
    Key: { playerName }
  };
  const result = await docClient.send(new GetCommand(params));
  return result.Item;
}

async function updatePlayerStats(playerName, won) {
  const updateExpression = won ? 'SET wins = wins + :inc' : 'SET losses = losses + :inc';
  const params = {
    TableName: TABLE_NAME,
    Key: { playerName },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: {
      ':inc': 1
    },
    ReturnValues: 'ALL_NEW'
  };
  const result = await docClient.send(new UpdateCommand(params));
  return result.Attributes;
}

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayerStats
};
