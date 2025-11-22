const request = require('supertest');
const app = require('./index');

describe('Hangman API', () => {
  const testPlayerName = 'TestPlayer' + Date.now();

  describe('POST /api/players', () => {
    test('should create a new player', async () => {
      const response = await request(app)
        .post('/api/players')
        .send({ playerName: testPlayerName })
        .expect(201);

      expect(response.body).toHaveProperty('playerName', testPlayerName);
      expect(response.body).toHaveProperty('wins', 0);
      expect(response.body).toHaveProperty('losses', 0);
    });

    test('should return 400 if playerName is missing', async () => {
      const response = await request(app)
        .post('/api/players')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Player name is required');
    });
  });

  describe('GET /api/players', () => {
    test('should get an existing player', async () => {
      const response = await request(app)
        .get(`/api/players?playerName=${testPlayerName}`)
        .expect(200);

      expect(response.body).toHaveProperty('playerName', testPlayerName);
      expect(response.body).toHaveProperty('wins');
      expect(response.body).toHaveProperty('losses');
    });

    test('should return 404 for non-existent player', async () => {
      const response = await request(app)
        .get('/api/players?playerName=NonExistentPlayer999999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Player not found');
    });

    test('should return 400 if playerName is missing', async () => {
      const response = await request(app)
        .get('/api/players')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Player name is required');
    });
  });

  describe('PUT /api/players/stats', () => {
    test('should update player stats for a win', async () => {
      const response = await request(app)
        .put('/api/players/stats')
        .send({ playerName: testPlayerName, won: true })
        .expect(200);

      expect(response.body).toHaveProperty('playerName', testPlayerName);
      expect(response.body.wins).toBeGreaterThan(0);
    });

    test('should update player stats for a loss', async () => {
      const response = await request(app)
        .put('/api/players/stats')
        .send({ playerName: testPlayerName, won: false })
        .expect(200);

      expect(response.body).toHaveProperty('playerName', testPlayerName);
      expect(response.body.losses).toBeGreaterThan(0);
    });

    test('should return 400 if playerName is missing', async () => {
      const response = await request(app)
        .put('/api/players/stats')
        .send({ won: true })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Player name and won status are required');
    });

    test('should return 400 if won status is missing', async () => {
      const response = await request(app)
        .put('/api/players/stats')
        .send({ playerName: testPlayerName })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Player name and won status are required');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
});
