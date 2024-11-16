import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './FinAibot.css';
import ChatInput from './components/ChatInput';
import Message from './components/Message';

const apiEndpoint = 'http://127.0.0.1:8000/v2/chatbot/ask-question/';

const FinAIbot = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    document.title = "Chat with Bot";
    const updateNavLinksColor = () => {
      const navLinks = document.querySelectorAll('.nav-links a');
      const scrollPosition = window.scrollY;
      
      navLinks.forEach(link => {
        link.style.color = scrollPosition > 50 ? 'white' : 'black';
      });
    };

    window.addEventListener('scroll', updateNavLinksColor);
    updateNavLinksColor();
    
    return () => window.removeEventListener('scroll', updateNavLinksColor);
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, isTyping]);

  const fetchBotResponse = async (question) => {
    setIsTyping(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!response.ok) {
        throw new Error('Error fetching the response');
      }

      const data = await response.json();
      setIsTyping(false);
      addMessage(data.answer, 'bot');
    } catch (error) {
      setIsTyping(false);
      console.error('Error:', error);
      addMessage('An error occurred while fetching the response.', 'bot');
    }
  };

  const addMessage = (text, type) => {
    const newMessage = {
      text,
      type,
      id: Date.now(),
      isLatest: true,
      hasAnimated: type === 'user'
    };
    
    setMessages(prev => prev.map(msg => ({
      ...msg,
      isLatest: false,
      hasAnimated: true
    })).concat(newMessage));
  };

  const handleSendMessage = (message) => {
    addMessage(message, 'user');
    fetchBotResponse(message);
  };

  return (
    <>
      <nav>
        <div className="logo-section">
          <img src="./Images/Logo.png" alt="Finerd Logo" className="logo" />
          <span className="finerd-text">FINERD</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home Page</Link>
          <Link to="/tools">Tools</Link>
          <a href="#">Finance Simulator</a>
          <Link to="/finaichatbot">ChatBot</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <div className="container">
        <div className="chat-container">
          <div className="chat-messages" ref={messagesContainerRef}>
            <div className="messages-wrapper">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="typing-indicator active" />
              )}
            </div>
          </div>

          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </>
  );
};

export default FinAIbot;