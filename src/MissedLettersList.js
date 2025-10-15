import React from 'react';

class MissedLettersList extends React.Component {
  render() {
    const { missedLetters } = this.props;

    const containerStyle = {
      margin: '20px 0',
      fontSize: '18px'
    };

    const headingStyle = {
      fontWeight: '600',
      marginBottom: '8px',
      color: '#333'
    };

    const lettersStyle = {
      fontSize: '20px',
      color: '#d32f2f',
      fontWeight: '600',
      letterSpacing: '3px'
    };

    return (
      <div style={containerStyle}>
        <h3 style={headingStyle}>Missed Letters:</h3>
        <p style={lettersStyle}>
          {missedLetters.length > 0 ? missedLetters.map(l => l.toUpperCase()).join(', ') : 'None'}
        </p>
      </div>
    );
  }
}

export default MissedLettersList;
