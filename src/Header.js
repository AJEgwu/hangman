import React from 'react';

class Header extends React.Component {
  render() {
    const headerStyle = {
      fontSize: '48px',
      fontWeight: '700',
      margin: '20px 0',
      color: '#333',
      letterSpacing: '2px'
    };

    return (
      <div>
        <h1 style={headerStyle}>HANGMAN</h1>
      </div>
    );
  }
}

export default Header;
