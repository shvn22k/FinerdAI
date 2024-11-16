import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './stocks.css';

const FinAIStocks = () => {
  useEffect(() => {
    // Ensure that only one instance of the widget script is added for the ticker
    if (!document.querySelector('#finlogix-widget-script')) {
      const script = document.createElement('script');
      script.id = 'finlogix-widget-script'; // Unique ID to prevent duplicate scripts
      script.src = 'https://widget.finlogix.com/Widget.js';
      script.async = true;
      script.onload = () => {
        if (window.Widget) {
          // Initialize the ticker widget
          window.Widget.init({
            widgetId: "6dff7ea5-a898-4ca6-8551-ae6fdf3eeb35",
            type: "StripBar",
            language: "en",
            symbolPairs: [
              { symbolId: "19", symbolName: "EUR/USD" },
              { symbolId: "36", symbolName: "USD/JPY" },
              { symbolId: "20", symbolName: "GBP/AUD" },
              { symbolId: "44", symbolName: "XAU/USD" },
              { symbolId: "45", symbolName: "WTI" },
              { symbolId: "52", symbolName: "SP500" }
            ],
            isAdaptive: true
          });
        }
      };
      document.body.appendChild(script);
    }

    // Ensure that the news widget is only loaded once
    if (!document.querySelector('#finlogix-news-widget-script')) {
      const newsScript = document.createElement('script');
      newsScript.id = 'finlogix-news-widget-script'; // Unique ID for the news widget script
      newsScript.src = 'https://widget.finlogix.com/Widget.js';
      newsScript.async = true;
      newsScript.onload = () => {
        if (window.Widget) {
          window.Widget.init({
            widgetId: "6dff7ea5-a898-4ca6-8551-ae6fdf3eeb35",
            type: "NewsFeed",
            language: "en",
            isAdaptive: true,
            withBorderBox: true
          });
        }
      };
      document.body.appendChild(newsScript);
    }

    return () => {
      // Cleanup any existing widget instances to avoid duplication
      const widgetContainer = document.querySelector('.finlogix-container');
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, []);

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
        <div className="finlogix-container"></div> {/* Ticker widget container */}

        {/* The news widget will be directly rendered below the ticker */}
        <div className="finlogix-news-container"></div> {/* News widget container */}
      </div>
    </>
  );
};

export default FinAIStocks;
