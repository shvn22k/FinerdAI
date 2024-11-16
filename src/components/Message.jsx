import React, { useState, useEffect } from 'react';

const Message = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [hasAnimated, setHasAnimated] = useState(message.hasAnimated);
  const isBot = message.type === 'bot';

  useEffect(() => {
    if (isBot && message.isLatest && !hasAnimated) {
      const speed = 30;
      let index = 0;
      
      const typing = setInterval(() => {
        setDisplayText(message.text.substring(0, index));
        index++;
        if (index > message.text.length) {
          clearInterval(typing);
          setHasAnimated(true);
        }
      }, speed);

      return () => clearInterval(typing);
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, isBot, message.isLatest, hasAnimated]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`message-container ${message.type === 'bot' ? '' : 'ml-auto'}`}>
      <div className={`message ${message.type}-message`}>
        <div className={isBot && message.isLatest && !hasAnimated ? 'typewriter-text' : ''}>
          {displayText}
        </div>
        {isBot && (
          <button className="copy-button" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;