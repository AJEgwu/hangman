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
      padding: '20px',
      border: '2px solid black',
      zIndex: 1000,
      textAlign: 'center'
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

    return (
      <div>
        <div style={overlayStyle} onClick={onClose}></div>
        <div style={modalStyle}>
          <h2>{message}</h2>
          <button onClick={onClose}>Play Again</button>
        </div>
      </div>
    );
  }
}

export default PopupModal;
