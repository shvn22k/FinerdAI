import React from "react";
import { Link } from "react-router-dom";

const MutualFunds = () => {
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
    <div style={{ width: "100%", height: "100vh"}}>
      <iframe
        src="https://mf-finerd.streamlit.app/?embed=true" // Replace with your Streamlit app URL
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Streamlit App"
        sandbox="allow-same-origin allow-scripts"
      ></iframe>
    </div>
    </>
  );
};

export default MutualFunds;