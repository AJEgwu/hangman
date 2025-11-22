const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { createPlayer, getPlayer, updatePlayerStats } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function initializeTable() {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8000',
    credentials: {
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy'
    }
  });

  const params = {
    TableName: 'HangmanPlayers',
    KeySchema: [
      { AttributeName: 'playerName', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'playerName', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log('Table created successfully');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('Table already exists');
    } else {
      console.error('Error creating table:', error);
    }
  }
}

app.post('/api/players', async (req, res) => {
  try {
    const { playerName } = req.body;
    if (!playerName) {
      return res.status(400).json({ error: 'Player name is required' });
    }
    const player = await createPlayer(playerName);
    res.status(201).json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

app.get('/api/players', async (req, res) => {
  try {
    const { playerName } = req.query;
    if (!playerName) {
      return res.status(400).json({ error: 'Player name is required' });
    }
    const player = await getPlayer(playerName);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({ error: 'Failed to get player' });
  }
});

app.put('/api/players/stats', async (req, res) => {
  try {
    const { playerName, won } = req.body;
    if (!playerName || won === undefined) {
      return res.status(400).json({ error: 'Player name and won status are required' });
    }
    const updatedPlayer = await updatePlayerStats(playerName, won);
    res.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player stats:', error);
    res.status(500).json({ error: 'Failed to update player stats' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

initializeTable().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
