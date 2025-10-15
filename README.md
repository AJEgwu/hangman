# Hangman Game

A React-based Hangman game with full game logic and Docker support.

## Features

- Guess letters to reveal the hidden word
- Visual hangman image updates with each wrong guess
- Track missed letters and remaining tries
- Auto-detect win/loss with popup modal
- New game functionality
- 6 maximum wrong guesses allowed

## Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Running with Docker

### Using Docker directly

1. Build the Docker image:
```bash
docker build -t hangman-game .
```

2. Run the container:
```bash
docker run -p 3000:3000 hangman-game
```

3. Open your browser and navigate to `http://localhost:3000`

### Using Docker Compose

1. Build and start the container:
```bash
docker-compose up
```

2. Open your browser and navigate to `http://localhost:3000`

3. To stop the container:
```bash
docker-compose down
```

## How to Play

1. Click "New Game" to start
2. Enter a letter in the input box and click "Search"
3. Correct guesses reveal letters in the word
4. Wrong guesses add to the missed letters list and update the hangman image
5. Win by guessing all letters before running out of tries
6. Lose if you make 6 wrong guesses
7. A popup will display when you win or lose with an option to play again

## Project Structure

- `src/HangmanGame.js` - Main game component with state management
- `src/Header.js` - Header component
- `src/NewGameButton.js` - New game button component
- `src/HangmanImage.js` - Displays hangman image
- `src/LetterBox.js` - Individual letter display component
- `src/SingleLetterSearchBar.js` - Letter input component
- `src/MissedLettersList.js` - Displays missed letters
- `src/PopupModal.js` - Win/lose popup modal
