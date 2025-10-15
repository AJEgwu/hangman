import React from 'react';

class HangmanImage extends React.Component {
  render() {
    const { imageSrc } = this.props;
    return (
      <div>
        <img src={imageSrc} alt="Hangman" />
      </div>
    );
  }
}

export default HangmanImage;
