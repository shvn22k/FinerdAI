import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './LoanApprovalPage.css';

const LoanApprovalPage = () => {
  const [dependents, setDependents] = useState('');
  const [educationalStatus, setEducationalStatus] = useState('');
  const [selfEmployed, setSelfEmployed] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [residentialAssets, setResidentialAssets] = useState('');
  const [commercialAssets, setCommercialAssets] = useState('');
  const [luxuryAssets, setLuxuryAssets] = useState('');
  const [bankAssets, setBankAssets] = useState('');
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionText, setPredictionText] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Handle number input to prevent unwanted changes
  const handleNumberInput = (value, setter) => {
    const numberValue = value.replace(/[^0-9]/g, '');
    setter(numberValue);
  };

  // Typewriter effect for prediction
  useEffect(() => {
    if (showPrediction) {
      const message = "This is a demo prediction for your loan approval";
      let index = 0;
      const speed = 30;

      const typing = setInterval(() => {
        setPredictionText(message.substring(0, index));
        index++;
        if (index > message.length) {
          clearInterval(typing);
        }
      }, speed);

      return () => clearInterval(typing);
    }
  }, [showPrediction]);

  // Error message timer
  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  const handlePredictLoanApproval = async (e) => {
    e.preventDefault();
    if (
      !dependents ||
      !educationalStatus ||
      !selfEmployed ||
      !annualIncome ||
      !loanAmount ||
      !loanTerm ||
      !creditScore ||
      !residentialAssets ||
      !commercialAssets ||
      !luxuryAssets ||
      !bankAssets
    ) {
      setShowErrorMessage(true);
    } else {
      try {
        //const token = "your-authentication-token"; // Replace with actual token retrieval

        const response = await fetch("http://localhost:8000/loanapproval", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //"Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            no_of_dependents: dependents,
            education: educationalStatus,
            self_employed: selfEmployed,
            income_annum: annualIncome,
            loan_amount: loanAmount,
            loan_term: loanTerm,
            cibil_score: creditScore,
            residential_assets_value: residentialAssets,
            commercial_assets_value: commercialAssets,
            luxury_assets_value: luxuryAssets,
            bank_asset_value: bankAssets,
          }),
        });

        const data = await response.json();
        setPredictionText(data.approval);
        setShowPrediction(true);
      } catch (error) {
        console.error("Error fetching prediction:", error);
        setShowErrorMessage(true);
      }
    }
  };

  const handleCheckAgain = () => {
    setDependents('');
    setEducationalStatus('');
    setSelfEmployed('');
    setAnnualIncome('');
    setLoanAmount('');
    setLoanTerm('');
    setCreditScore('');
    setResidentialAssets('');
    setCommercialAssets('');
    setLuxuryAssets('');
    setBankAssets('');
    setShowPrediction(false);
    setPredictionText('');
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

      <main className="hero-section">
        <div className="content-wrapper">
          <h1 className="main-title">LOAN APPROVAL</h1>
          <div className="description">
            Fill the following details to check your eligibility 
          </div>
          
          <form onSubmit={handlePredictLoanApproval}>
            <div className="form-group">
              <label htmlFor="dependents">Enter number of dependents</label>
              <input
                type="text"
                id="dependents"
                value={dependents}
                onChange={(e) => handleNumberInput(e.target.value, setDependents)}
              />
            </div>
            
            <div className="form-group">
              <label>Educational Status</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="Not Graduate"
                    checked={educationalStatus === 'Not Graduate'}
                    onChange={(e) => setEducationalStatus(e.target.value)}
                  />
                  Not Graduate
                </label>
                <label>
                  <input
                    type="radio"
                    value="Graduate"
                    checked={educationalStatus === 'Graduate'}
                    onChange={(e) => setEducationalStatus(e.target.value)}
                  />
                  Graduate
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Are you self employed?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="Yes"
                    checked={selfEmployed === 'Yes'}
                    onChange={(e) => setSelfEmployed(e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    checked={selfEmployed === 'No'}
                    onChange={(e) => setSelfEmployed(e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="annualIncome">Annual Income (In Dollars) </label>
              <input
                type="text"
                id="annualIncome"
                value={annualIncome}
                onChange={(e) => handleNumberInput(e.target.value, setAnnualIncome)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loanAmount">Enter loan amount</label>
              <input
                type="text"
                id="loanAmount"
                value={loanAmount}
                onChange={(e) => handleNumberInput(e.target.value, setLoanAmount)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loanTerm">Loan Term (months)</label>
              <input
                type="text"
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => handleNumberInput(e.target.value, setLoanTerm)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="creditScore">Credit/CIBIL Score</label>
              <input
                type="text"
                id="creditScore"
                value={creditScore}
                onChange={(e) => handleNumberInput(e.target.value, setCreditScore)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="residentialAssets">Residential assets value</label>
              <input
                type="text"
                id="residentialAssets"
                value={residentialAssets}
                onChange={(e) => handleNumberInput(e.target.value, setResidentialAssets)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="commercialAssets">Commercial assets value</label>
              <input
                type="text"
                id="commercialAssets"
                value={commercialAssets}
                onChange={(e) => handleNumberInput(e.target.value, setCommercialAssets)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="luxuryAssets">Luxury assets value</label>
              <input
                type="text"
                id="luxuryAssets"
                value={luxuryAssets}
                onChange={(e) => handleNumberInput(e.target.value, setLuxuryAssets)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bankAssets">Bank assets value</label>
              <input
                type="text"
                id="bankAssets"
                value={bankAssets}
                onChange={(e) => handleNumberInput(e.target.value, setBankAssets)}
              />
            </div>

            {!showPrediction && (
              <button type="submit" className="cta-button">
                Predict Loan Approval
              </button>
            )}
          </form>

          {showErrorMessage && (
            <div className="error-message">
              Please fill all the necessary Information
            </div>
          )}

          {showPrediction && (
            <div className="prediction-result">
              <div className="typewriter-text typing">
                {predictionText}
              </div>
              <button
                className="cta-button check-again-button"
                onClick={handleCheckAgain}
              >
                Check Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LoanApprovalPage;
