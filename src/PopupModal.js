import React from 'react';

class PopupModal extends React.Component {
  render() {
    const { isOpen, message, onClose } = this.props;

    if (!isOpen) {
      return null;
    }

    const modalStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '40px',
      border: 'none',
      borderRadius: '16px',
      zIndex: 1000,
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      minWidth: '300px'
    };

    const overlayStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999
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
      fontFamily: 'Poppins, sans-serif',
      marginTop: '20px'
    };

    const headingStyle = {
      fontSize: '28px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '10px'
    };

    return (
      <div>
        <div style={overlayStyle} onClick={onClose}></div>
        <div style={modalStyle}>
          <h2 style={headingStyle}>{message}</h2>
          <button onClick={onClose} style={buttonStyle}>Play Again</button>
        </div>
      </div>
    );
  }
}

export default PopupModal;
