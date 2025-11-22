# Hangman Game

A React-based Hangman game with player tracking, statistics, and Docker support using DynamoDB.

## Features

- Player login system with persistent stats
- Track wins, losses, and win percentage per player
- Guess letters to reveal the hidden word
- Visual hangman image updates with each wrong guess
- Track missed letters and remaining tries
- Auto-detect win/loss with popup modal
- New game functionality
- 6 maximum wrong guesses allowed
- REST API backend with DynamoDB storage

## Running with Docker Compose (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Docker Compose

### Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Start all services using Docker Compose:
```bash
docker-compose up
```

This will start:
- DynamoDB Local on port 8000
- DynamoDB Admin UI on port 8001
- Backend API server on port 5001
- Frontend React app on port 3000

3. Access the application:
- **Game**: http://localhost:3000
- **DynamoDB Admin**: http://localhost:8001
- **API Health Check**: http://localhost:5001/health

4. To stop all services:
```bash
docker-compose down
```

## Running Locally (Without Docker)

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start DynamoDB Local (in a separate terminal):
```bash
docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```

3. Start the backend API server (in a separate terminal):
```bash
npm run server
```

4. Start the frontend development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Testing

### Run Frontend Tests
```bash
npm test
```

This runs all React component tests including:
- Player login functionality
- Player name input
- Stats display (wins, losses, win percentage)

### Run API Tests
```bash
npm run test:api
```

This runs server-side API tests including:
- POST /api/players (create player)
- GET /api/players (get player by name)
- PUT /api/players/stats (update player stats)

## How to Play

1. Enter your player name and click "Login"
   - If you're a new player, you'll be created in the database
   - If you're a returning player, your stats will be loaded
2. Your player name and stats (wins, losses, win rate) will be displayed
3. Click "New Game" to start
4. Enter a letter in the input box and click "Search" or use the on-screen keyboard
5. Correct guesses reveal letters in the word
6. Wrong guesses add to the missed letters list and update the hangman image
7. Win by guessing all letters before running out of tries
8. Lose if you make 6 wrong guesses
9. Your stats will automatically update after each game
10. A popup will display when you win or lose with an option to play again

## API Endpoints

### GET /api/players
Get player by name
- Query Parameters: `playerName` (required)
- Response: `{ playerName: string, wins: number, losses: number }`

### POST /api/players
Create a new player
- Body: `{ playerName: string }`
- Response: `{ playerName: string, wins: 0, losses: 0 }`

### PUT /api/players/stats
Update player statistics
- Body: `{ playerName: string, won: boolean }`
- Response: `{ playerName: string, wins: number, losses: number }`

### GET /health
Health check endpoint
- Response: `{ status: "ok" }`

## Project Structure

### Frontend
- `src/HangmanGame.js` - Main game component with state management and player tracking
- `src/Header.js` - Header component
- `src/NewGameButton.js` - New game button component
- `src/HangmanImage.js` - Displays hangman image
- `src/LetterBox.js` - Individual letter display component
- `src/SingleLetterSearchBar.js` - Letter input component
- `src/MissedLettersList.js` - Displays missed letters
- `src/PopupModal.js` - Win/lose popup modal
- `src/Keyboard.js` - On-screen keyboard component
- `src/HangmanGame.test.js` - Frontend tests

### Backend
- `server/index.js` - Express API server with DynamoDB integration
- `server/db.js` - DynamoDB client and database operations
- `server/index.test.js` - API endpoint tests

### Docker Configuration
- `docker-compose.yml` - Multi-container setup (DynamoDB, API, Frontend)
- `Dockerfile` - Frontend container configuration
- `Dockerfile.api` - Backend API container configuration

## Testing API with Postman

You can test the API endpoints using Postman:

1. **Create a new player**
   - Method: POST
   - URL: `http://localhost:5001/api/players`
   - Body (JSON): `{ "playerName": "JohnDoe" }`

2. **Get a player**
   - Method: GET
   - URL: `http://localhost:5001/api/players?playerName=JohnDoe`

3. **Update player stats (win)**
   - Method: PUT
   - URL: `http://localhost:5001/api/players/stats`
   - Body (JSON): `{ "playerName": "JohnDoe", "won": true }`

4. **Update player stats (loss)**
   - Method: PUT
   - URL: `http://localhost:5001/api/players/stats`
   - Body (JSON): `{ "playerName": "JohnDoe", "won": false }`

5. **Health check**
   - Method: GET
   - URL: `http://localhost:5001/health`

## Technologies Used

- **Frontend**: React, React Testing Library
- **Backend**: Express.js, AWS SDK for JavaScript v3
- **Database**: DynamoDB Local
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Docker Compose
