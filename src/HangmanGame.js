import './App.css';
import React from 'react';
import Header from './Header';
import NewGameButton from './NewGameButton';
import HangmanImage from './HangmanImage';
import LetterBox from './LetterBox';
import SingleLetterSearchbar from './SingleLetterSearchBar';
import MissedLettersList from './MissedLettersList';
import PopupModal from './PopupModal';
import Keyboard from './Keyboard';

const pics = ['noose.png', 'upperbody.png', 'upperandlowerbody.png', '1arm.png', 'botharms.png', '1leg.png', 'Dead.png'];
const words = ["Morehouse", "Spelman", "Basketball", "Table", "Museum", "Excellent", "Fun", "React"];
const MAX_WRONG_GUESSES = 6;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class HangmanGame extends React.Component {
  state = {
    wordList: words,
    curWord: 0,
    guessedLetters: [],
    missedLetters: [],
    showModal: false,
    gameWon: false,
    playerName: '',
    playerStats: null,
    isLoggedIn: false,
    loginInput: ''
  }

  componentDidMount() {
    if (this.state.isLoggedIn) {
      this.startNewGame();
    }
  }

  handleLogin = async () => {
    const { loginInput } = this.state;
    if (!loginInput.trim()) {
      alert('Please enter a player name');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/players?playerName=${encodeURIComponent(loginInput)}`);
      if (response.ok) {
        const player = await response.json();
        this.setState({
          playerName: loginInput,
          playerStats: player,
          isLoggedIn: true
        }, this.startNewGame);
      } else if (response.status === 404) {
        const createResponse = await fetch(`${API_URL}/api/players`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerName: loginInput })
        });
        const newPlayer = await createResponse.json();
        this.setState({
          playerName: loginInput,
          playerStats: newPlayer,
          isLoggedIn: true
        }, this.startNewGame);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login. Please make sure the server is running.');
    }
  }

  startNewGame = () => {
    this.setState({
      curWord: Math.floor(Math.random() * this.state.wordList.length),
      guessedLetters: [],
      missedLetters: [],
      showModal: false,
      gameWon: false
    });
  }

  handleGuess = (letter) => {
    const lowerLetter = letter.toLowerCase();
    const { guessedLetters, missedLetters, wordList, curWord } = this.state;

    // Show popup if already guessed
    if (guessedLetters.includes(lowerLetter)) {
      alert(`You already guessed the letter "${lowerLetter.toUpperCase()}"!`);
      return;
    }

    const currentWord = wordList[curWord].toLowerCase();
    const newGuessedLetters = [...guessedLetters, lowerLetter];

    // Check if letter is in the word
    if (currentWord.includes(lowerLetter)) {
      this.setState({ guessedLetters: newGuessedLetters }, this.checkWin);
    } else {
      const newMissedLetters = [...missedLetters, lowerLetter];
      this.setState({
        guessedLetters: newGuessedLetters,
        missedLetters: newMissedLetters
      }, this.checkLoss);
    }
  }

  checkWin = async () => {
    const { wordList, curWord, guessedLetters } = this.state;
    const currentWord = wordList[curWord].toLowerCase();
    const wordLetters = [...new Set(currentWord.split(''))];

    const hasWon = wordLetters.every(letter => guessedLetters.includes(letter));

    if (hasWon) {
      await this.updateStats(true);
      this.setState({ showModal: true, gameWon: true });
    }
  }

  checkLoss = async () => {
    const { missedLetters } = this.state;

    if (missedLetters.length >= MAX_WRONG_GUESSES) {
      await this.updateStats(false);
      this.setState({ showModal: true, gameWon: false });
    }
  }

  updateStats = async (won) => {
    const { playerName, playerStats } = this.state;
    const updatedStats = {
      ...playerStats,
      wins: won ? playerStats.wins + 1 : playerStats.wins,
      losses: won ? playerStats.losses : playerStats.losses + 1
    };
    this.setState({ playerStats: updatedStats });

    try {
      await fetch(`${API_URL}/api/players/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, won })
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  closeModal = () => {
    this.setState({ showModal: false });
    this.startNewGame();
  }

  render(){
    const { wordList, curWord, guessedLetters, missedLetters, showModal, gameWon, isLoggedIn, loginInput, playerName, playerStats } = this.state;
    const word = wordList[curWord];
    const wrongGuessCount = missedLetters.length;
    const triesLeft = MAX_WRONG_GUESSES - wrongGuessCount;

    if (!isLoggedIn) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Header />
          <div style={{ marginTop: '50px' }}>
            <h2>Enter Your Name to Play</h2>
            <div style={{ marginTop: '20px' }}>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => this.setState({ loginInput: e.target.value })}
                placeholder="Player Name"
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '2px solid #333',
                  width: '250px'
                }}
                onKeyPress={(e) => e.key === 'Enter' && this.handleLogin()}
              />
            </div>
            <button
              onClick={this.handleLogin}
              style={{
                marginTop: '20px',
                padding: '10px 30px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </div>
        </div>
      );
    }

    const totalGames = playerStats.wins + playerStats.losses;
    const winPercentage = totalGames > 0 ? ((playerStats.wins / totalGames) * 100).toFixed(1) : 0;

    return(
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Header />

        <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'inline-block' }}>
          <h3 style={{ margin: '5px 0' }}>Player: {playerName}</h3>
          <p style={{ margin: '5px 0' }}>Wins: {playerStats.wins} | Losses: {playerStats.losses} | Win Rate: {winPercentage}%</p>
        </div>

        <HangmanImage imageSrc={pics[wrongGuessCount]} />

        <div style={{ margin: '20px 0' }}>
          <p style={{
            fontSize: '20px',
            fontWeight: '600',
            color: triesLeft <= 2 ? '#d32f2f' : '#333'
          }}>
            Tries Left: {triesLeft}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '20px' }}>
          {word.split('').map((letter, index) => (
            <LetterBox
              key={index}
              letter={letter}
              isVisible={guessedLetters.includes(letter.toLowerCase())}
              boxStyle={{ backgroundColor: 'lightblue' }}
              letterStyle={{ color: 'black', fontSize: '30px' }}
            />
          ))}
        </div>

        <SingleLetterSearchbar onSearch={this.handleGuess} />

        <MissedLettersList missedLetters={missedLetters} />

        <Keyboard guessedLetters={guessedLetters} onLetterClick={this.handleGuess} />

        <NewGameButton onNewGame={this.startNewGame} />

        <PopupModal
          isOpen={showModal}
          message={gameWon ? `You Won! The word was ${word}` : `You Lost! The word was ${word}`}
          onClose={this.closeModal}
        />
      </div>
    )
  }

}



export default HangmanGame;
