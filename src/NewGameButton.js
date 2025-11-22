import React from 'react';

class NewGameButton extends React.Component {
  render() {
    const buttonStyle = {
      padding: '12px 30px',
      fontSize: '18px',
      fontWeight: '600',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
      marginTop: '20px'
    };

    return (
      <button onClick={this.props.onNewGame} style={buttonStyle}>New Game</button>
    );
  }
}

export default NewGameButton;
