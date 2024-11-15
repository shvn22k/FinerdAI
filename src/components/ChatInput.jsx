import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  return (
    <div className="input-section">
      <div className="tabs">
        {['What is mutual funds?', 'What is cryptocurrency?', 'What does stocks mean in general?'].map((tab, index) => (
          <button
            key={index}
            className="tab"
            onClick={() => onSendMessage(`Selected: ${tab}`)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInput;