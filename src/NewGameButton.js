import React from 'react';

class NewGameButton extends React.Component {
  render() {
    return (
      <button onClick={this.props.onNewGame}>New Game</button>
    );
  }
}

export default NewGameButton;
