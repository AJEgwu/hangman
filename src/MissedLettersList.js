import React from 'react';

class MissedLettersList extends React.Component {
  render() {
    const { missedLetters } = this.props;
    return (
      <div>
        <h3>Missed Letters:</h3>
        <p>{missedLetters.length > 0 ? missedLetters.join(', ') : 'None'}</p>
      </div>
    );
  }
}

export default MissedLettersList;
