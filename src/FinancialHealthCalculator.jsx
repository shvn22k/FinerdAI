import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import './FinancialHealthCalculator.css';

const FinancialHealthCalculator = () => {
  const [formData, setFormData] = useState({
    monthly_income: '',
    monthly_expenses: '',
    total_debt: '',
    total_savings: '',
    total_investments: ''
  });

  const [report, setReport] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || ''
    }));
  };

  const calculateFinancialHealth = () => {
    const {
      monthly_income,
      monthly_expenses,
      total_debt,
      total_savings,
      total_investments
    } = formData;

    // Calculate savings ratio
    const monthly_savings = monthly_income - monthly_expenses;
    const savings_ratio = monthly_income ? (monthly_savings / monthly_income) * 100 : 0;

    // Calculate debt-to-income ratio
    const dti_ratio = monthly_income ? (total_debt / (monthly_income * 12)) * 100 : 0;

    // Calculate emergency fund ratio
    const emergency_months = monthly_expenses ? total_savings / monthly_expenses : 0;

    // Calculate net worth
    const net_worth = (total_savings + total_investments) - total_debt;

    // Calculate score
    let score = 0;

    // Savings ratio evaluation
    if (savings_ratio >= 20) score += 25;
    else if (savings_ratio >= 10) score += 15;
    else if (savings_ratio > 0) score += 5;

    // Debt-to-income evaluation
    if (dti_ratio <= 20) score += 25;
    else if (dti_ratio <= 36) score += 15;
    else if (dti_ratio <= 43) score += 5;

    // Emergency fund evaluation
    if (emergency_months >= 6) score += 25;
    else if (emergency_months >= 3) score += 15;
    else if (emergency_months >= 1) score += 5;

    // Net worth evaluation
    if (net_worth > monthly_income * 12) score += 25;
    else if (net_worth > monthly_income * 6) score += 15;
    else if (net_worth > 0) score += 5;

    // Generate recommendations
    const recommendations = [];
    if (savings_ratio < 20) {
      recommendations.push("Try to increase your savings ratio to at least 20% of income");
    }
    if (dti_ratio > 36) {
      recommendations.push("Work on reducing your debt-to-income ratio to below 36%");
    }
    if (emergency_months < 6) {
      recommendations.push("Build your emergency fund to cover 6 months of expenses");
    }
    if (net_worth < 0) {
      recommendations.push("Focus on building positive net worth through debt reduction and saving");
    }

    setReport({
      overall_score: score,
      metrics: {
        savings_ratio: savings_ratio.toFixed(2),
        debt_to_income_ratio: dti_ratio.toFixed(2),
        emergency_fund_months: emergency_months.toFixed(2),
        net_worth: net_worth.toFixed(2),
      },
      recommendations
    });
  };

  return (
    <div className="calculator-container">
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

      <main className="main-content">
        <div className="calculator-wrapper">
          <div className="input-section">
            <h1 className="calculator-title">
              <Calculator className="title-icon" />
              Financial Health Calculator
            </h1>
            <p className="calculator-subtitle">Calculate your overall financial health score and get personalized recommendations</p>
            
            <div className="input-fields">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="input-group">
                  <label htmlFor={key}>{key.replace(/_/g, ' ').toUpperCase()}</label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                  />
                </div>
              ))}
            </div>

            <button 
              className="calculate-button"
              onClick={calculateFinancialHealth}
              disabled={Object.values(formData).some(val => val === '')}
            >
              Calculate Health Score
              <ArrowRight size={20} />
            </button>
          </div>

          {report && (
            <div className="results-section">
              <div className="score-card">
                <h2>Your Financial Health Score</h2>
                <div className="score-display">
                  <div className="score-circle" style={{ 
                    background: `conic-gradient(#4df8df ${report.overall_score}%, #12352f ${report.overall_score}%)`
                  }}>
                    <span>{report.overall_score}</span>
                  </div>
                </div>
              </div>

              <div className="metrics-grid">
                {Object.entries(report.metrics).map(([key, value]) => (
                  <div key={key} className="metric-card">
                    <h3>{key.replace(/_/g, ' ').toUpperCase()}</h3>
                    <p className="metric-value">{value}</p>
                  </div>
                ))}
              </div>

              {report.recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h3>
                    <AlertCircle className="recommendation-icon" />
                    Recommendations
                  </h3>
                  <ul className="recommendations-list">
                    {report.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FinancialHealthCalculator;