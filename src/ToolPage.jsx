import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { Calculator, TrendingUp, PiggyBank, ChartArea, Wallet, Newspaper, Rss } from 'lucide-react';
import './ToolPage.css';

const FinerdTools = () => {
  const navigate = useNavigate();
  const tools = [
    {
      title: "Financial Health Calculator",
      description: "Calculates and tell you about your financial health metrics and provides its judgement based on your information.",
      icon: <Calculator size={32} />,
      comingSoon: false,
      linkto: "/financialhealth" 
    },
    {
      title: "Virtual Stock Game",
      description: "A game finely made by our experts using MarketWatch, which enables you to compete in real world without any money.",
      icon: <TrendingUp size={32} />,
      comingSoon: false,
      linkto: "/" //change here
    },
    {
      title: "Loan Approval Prediction",
      description: "This Tool Predicts chances of getting your loan approved using Machine Learning model with 97.5% accuracy.",
      icon: <PiggyBank size={32} />,
      comingSoon: false,
      linkto: "/loanapproval" 
    },
    {
      title: "Mutual Fund Trends",
      description: "Provides you with real-time mutual funds nav data in form of interactive visualisation with trend lines.",
      icon: <ChartArea size={32} />,
      comingSoon: false,
      linkto: "/mutualfunds" 
    },
    {
      title: "Portfolio Assesment",
      description: "AI based judgement and recommendations based on your investment portfolio",
      icon: <Wallet size={32} />,
      comingSoon: true,
      linkto: "/" //change here
    },
    {
      title: "Stocks Market News",
      description: "Latest news related to the international stock market fetched freshly from our parntner service.",
      icon: <Newspaper size={32} />,
      comingSoon: false,
      linkto: "/stocksnews" 
    },
    {
      title: "Read or Submit a Blog",
      description: "When you submit a blog it would be Converted to podcast and then stored into our dedicated NAS for fast retrieval.",
      icon: <Rss size={32} />,
      comingSoon: false,
      linkto: "/blogsubmit" 
    }
  ];

  const handleButtonClick = (destination) => {
    console.log(destination);
    navigate(destination);
  };

  return (
    <div className="tools-container">
      {/* Navigation Bar */}
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

      {/* Main Content */}
      <main className="main-content">
        {/* Page Title */}
        <div className="page-header">
          <h1 className="page-title">Financial Tools</h1>
          <p className="page-subtitle">
            Explore our suite of financial tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="tools-grid">
          {tools.map((tool) => (
            <div key={tool.title} className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">
                  {tool.icon}
                </div>
                {tool.comingSoon && (
                  <span className="coming-soon-badge">
                    Coming Soon
                  </span>
                )}
              </div>
              
              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-description">{tool.description}</p>
              
              <button
                className={`tool-button ${tool.comingSoon ? 'notify' : 'launch'}`}
                disabled={tool.comingSoon}
                onClick={() => handleButtonClick(tool.linkto)}
              >
                {tool.comingSoon ? 'Notify Me' : 'Launch Tool'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FinerdTools;