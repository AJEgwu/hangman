import React from 'react';


// Use this class to allow the user to enter a letter
// this class needs a function passed as a prop called onSearch to handle the user's request
class SingleLetterSearchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

    handleInputChange = (event) => {
        const value = event.target.value.charAt(0); // Get only the first character
        this.setState({
            inputValue: value}
        );
    };

    handleSearchClick = () => {
        if (this.state.inputValue.length === 1) {
            this.props.onSearch(this.state.inputValue);
        } else {
            alert('Please enter a single letter.');
        }
        // Clear input after search
        this.setState({
            inputValue: ''
        });
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSearchClick();
        }
    };

  render() {
    const inputStyle = {
      padding: '12px 20px',
      fontSize: '18px',
      border: '2px solid #333',
      borderRadius: '8px',
      marginRight: '10px',
      width: '60px',
      textAlign: 'center',
      fontWeight: '600',
      fontFamily: 'Poppins, sans-serif'
    };

    const buttonStyle = {
      padding: '12px 30px',
      fontSize: '18px',
      fontWeight: '600',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif'
    };

    return (
      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
          maxLength={1}
          style={inputStyle}
          placeholder="?"
        />
        <button onClick={this.handleSearchClick} style={buttonStyle}>Search</button>
      </div>
    );
  }
}

export default SingleLetterSearchbar;