// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const LandingPage = () => {
  const [displayText, setDisplayText] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDescription(true);
      setShowCards(true);
      typeMessage("THIS IS A DEMO DESCRIPTION FOR THIS SITE. THIS IS A LONGER DESCRIPTION TO SHOW HOW THE TEXT WRAPS AND ANIMATES WITH THE TYPEWRITER EFFECT. YOU CAN ADD MORE TEXT HERE TO MAKE IT EVEN LONGER IF NEEDED.", setDisplayText);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const typeMessage = (text, setDisplayText) => {
    let index = 0;
    const speed = 30;

    const typing = setInterval(() => {
      setDisplayText(text.substring(0, index));
      index++;
      if (index > text.length) {
        clearInterval(typing);
      }
    }, speed);

    return () => clearInterval(typing);
  };

  return (
    <div className="landing-container">
      <nav>
        <div className="logo-section">
          <img src="./Images/Logo.png" alt="Finerd Logo" className="logo" />
          <span className="finerd-text">FINERD</span>
        </div>
        <div className="nav-links">
          <a href="#">Home Page</a>
          <a href="#">Button2</a>
          <a href="#">Button3</a>
          <a href="#">Button4</a>
          <a href="#">Button5</a>
        </div>
      </nav>
      
      <main className="hero-section">
        <div className="content-wrapper">
          <h1 className="main-title">FINERD</h1>
          <div className={`description ${showDescription ? 'show' : ''}`}>
            <div className={`typewriter-text ${showDescription ? 'typing' : ''}`}>
              {displayText}
            </div>
          </div>
          <button className="cta-button">
            CONTINUE TO CHATBOT
          </button>
        </div>
        
        <div className="cards-container">
          <div className={`card-wrapper ${showCards ? 'show' : ''}`} style={{ animationDelay: '1s' }}>
            <div className="info-card">
              <img src="/path-to-your-image1.jpg" alt="Info Card 1" />
              <div className="card-popup">Demo Text 1</div>
            </div>
          </div>
          <div className={`card-wrapper ${showCards ? 'show' : ''}`} style={{ animationDelay: '1.2s' }}>
            <div className="info-card">
              <img src="/path-to-your-image2.jpg" alt="Info Card 2" />
              <div className="card-popup">Demo Text 2</div>
            </div>
          </div>
          <div className={`card-wrapper ${showCards ? 'show' : ''}`} style={{ animationDelay: '1.4s' }}>
            <div className="info-card">
              <img src="/path-to-your-image3.jpg" alt="Info Card 3" />
              <div className="card-popup">Demo Text 3</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;