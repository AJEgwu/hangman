import React from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

class Keyboard extends React.Component {
  handleLetterClick = (letter) => {
    const { guessedLetters, onLetterClick } = this.props;

    // Only handle click if letter hasn't been guessed yet
    if (!guessedLetters.includes(letter.toLowerCase())) {
      onLetterClick(letter);
    }
  };

  render() {
    const { guessedLetters } = this.props;

    const keyStyle = (letter) => {
      const isGuessed = guessedLetters.includes(letter.toLowerCase());
      return {
        width: '40px',
        height: '45px',
        margin: '4px',
        border: '2px solid #333',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: isGuessed ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isGuessed ? '#ddd' : '#fff',
        color: isGuessed ? '#999' : '#333',
        boxShadow: isGuessed ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        userSelect: 'none'
      };
    };

    return (
      <div style={{ margin: '20px 0' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {ALPHABET.map((letter) => (
            <div
              key={letter}
              style={keyStyle(letter)}
              onClick={() => this.handleLetterClick(letter)}
              onMouseEnter={(e) => {
                if (!guessedLetters.includes(letter.toLowerCase())) {
                  e.target.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!guessedLetters.includes(letter.toLowerCase())) {
                  e.target.style.backgroundColor = '#fff';
                }
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Keyboard;
