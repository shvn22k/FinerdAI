import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import LoginPage from './LoginPage';
import FinerdTools from "./ToolPage";
import FinAibot from './FinAibot';
import LandingPage from './LandingPage';
import LoanApprovalPage from './LoanApprovalPage';
import reportWebVitals from './reportWebVitals';
import MutualFunds from './MutualFunds';
import FinancialHealthCalculator from './FinancialHealthCalculator';
import BlogSubmit from './blogs';
import FinAIStocks from './stocks';
import BlogPageRead from './BlogsRead';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.title = 'Finerd: Finance Assistant';
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Define additional routes for all pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/finaichatbot" element={<FinAibot />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tools" element={<FinerdTools />} />
        <Route path="/loanapproval" element={<LoanApprovalPage />} />
        <Route path="/mutualfunds" element={<MutualFunds />} />
        <Route path="/financialhealth" element={<FinancialHealthCalculator />} />
        <Route path="/blogsubmit" element={<BlogSubmit />} />
        <Route path="/blogsread" element={<BlogPageRead />} />
        <Route path="/stocksnews" element={<FinAIStocks />} />

      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
