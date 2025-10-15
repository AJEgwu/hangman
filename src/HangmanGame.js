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

class HangmanGame extends React.Component {
  state = {
    wordList: words,
    curWord: 0,
    guessedLetters: [],
    missedLetters: [],
    showModal: false,
    gameWon: false
  }

  componentDidMount() {
    this.startNewGame();
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

  checkWin = () => {
    const { wordList, curWord, guessedLetters } = this.state;
    const currentWord = wordList[curWord].toLowerCase();
    const wordLetters = [...new Set(currentWord.split(''))];

    const hasWon = wordLetters.every(letter => guessedLetters.includes(letter));

    if (hasWon) {
      this.setState({ showModal: true, gameWon: true });
    }
  }

  checkLoss = () => {
    const { missedLetters } = this.state;

    if (missedLetters.length >= MAX_WRONG_GUESSES) {
      this.setState({ showModal: true, gameWon: false });
    }
  }

  closeModal = () => {
    this.setState({ showModal: false });
    this.startNewGame();
  }

  render(){
    const { wordList, curWord, guessedLetters, missedLetters, showModal, gameWon } = this.state;
    const word = wordList[curWord];
    const wrongGuessCount = missedLetters.length;
    const triesLeft = MAX_WRONG_GUESSES - wrongGuessCount;

    return(
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Header />

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
