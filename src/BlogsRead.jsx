import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BlogsRead.css';

const BlogPageRead = () => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const blogs = [
    {
      title: "Smart Investing for Beginners",
      description: "This blog explains the basics of investing, making it easy for beginners to understand how to grow their wealth over time.",
      link: "https://write.as/nro9yye53647v.md",
    },
    {
      title: "Financial Literacy: A Skill Everyone Needs",
      description: "This blog highlights the importance of financial literacy and how it empowers individuals to make smarter financial decisions.",
      link: "https://write.as/bjucvb8hgc9ai.md",
    },
    {
      title: "Debt Management: A Roadmap to Becoming Debt-Free",
      description: "This blog provides practical strategies to help individuals manage and eliminate debt effectively.",
      link: "https://write.as/7ipimgvmc6yim.md",
    },
    {
      title: "Emergency Funds: Why and How to Build One",
      description: "This blog explores the importance of having an emergency fund and provides tips on how to start one.",
      link: "https://write.as/nakzlfufud9d9.md",
    },
    {
      title: "Budgeting 101: Master Your Money",
      description: "This blog covers the basics of budgeting, helping individuals take control of their finances and make informed decisions.",
      link: "https://write.as/6kwsubrtcwb5d.md",
    }
  ];

  const handleButtonClick = () => {
    navigate('/blogsubmit');
  };

  return (
    <div className="landing-container">
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

      <main className="blog-container">
        <div className="blog-list">
          {blogs.map((blog, index) => (
            <div 
              key={index}
              className={`blog-card ${animate ? 'show' : ''}`}
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <h2>{blog.title}</h2>
              <p>{blog.description}</p>
              <a href={blog.link} target="_blank" rel="noopener noreferrer" className="read-more">
                <span>Read Blog</span>
                <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>

        <div className={`right-section ${animate ? 'show' : ''}`}>
          <div className="image-container">
            <img src="./Images/doodle3.png" alt="Blog Feature" />
          </div>
            <button className="cta-button create-blog-btn" onClick={handleButtonClick}>
              Create Blog +
            </button>
        </div>
      </main>
    </div>
  );
};

export default BlogPageRead;
