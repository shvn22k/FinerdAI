import React from "react";
import { Link } from "react-router-dom";
import BlogEditor from "./components/blogComponent"

const BlogSubmit = () => {
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
    <div>
      <React.StrictMode>
        <BlogEditor />
      </React.StrictMode>
    </div>
    </>
  );
};

export default BlogSubmit;