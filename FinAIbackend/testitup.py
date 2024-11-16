from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import UserProfile
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/mock-scenario")
async def mock_scenario(userprofile : UserProfile):
    print(userprofile)
    resp={ "title": "**** The Cyber Expert's Dilemma", "description": "**Description:** Sumit, a cybersecurity expert with a comfortable annual income of $300,000, faces a financial conundrum that could derail his ambitious financial goals. With a desire to open a bakery and establish a private server, Sumit must navigate a risky decision that has the potential to make or break his dreams.", "choices": [ "- Invest a significant portion of his income in the bakery venture, potentially jeopardizing his financial stability.", "- Take out a large loan to cover the costs of the private server, risking high interest rates and debt repayment obligations.", "- Diversify his investments by allocating funds between the bakery and the server, reducing risk but potentially limiting growth potential." ], "learning_points": [ "Diversification can reduce financial risk but may limit growth potential.", "Highrisk ventures carry the potential for significant financial gain but also the risk of loss.", "Loan obligations can slow progress towards financial goals and increase financial burden.", "Balancing risk and reward is important when considering financial decisions.", "Carefully evaluating the risks and benefits of different investment options is crucial for informed decisionmaking." ], "consequences": [ { "choice": "Invest a significant portion of income in the bakery venture", "short_term_impact": "Reduction in savings and available cash flow", "long_term_impact": "Potential for significant financial gain or loss depending on the success of the bakery", "risks_and_benefits": "risks: Financial instability if the bakery venture fails, Loss of capital benefits: High potential for business growth and wealth accumulation if the bakery succeeds" }, { "choice": "Take out a large loan for the private server", "short_term_impact": "Increased monthly loan payments and debt obligations", "long_term_impact": "Slower progress towards financial goals due to loan repayments, increased interest expenses", "risks_and_benefits": "risks: Default on loan payments, Damage to credit score, Potential foreclosure benefits: Access to necessary equipment and resources for private server, Potential for increased income" }, { "choice": "Diversify investments between the bakery and the server", "short_term_impact": "Reduced financial risk compared to investing heavily in either venture", "long_term_impact": "Limited growth potential compared to focusing on a single venture, balance between risk and reward", "risks_and_benefits": "risks: Lower potential for financial gains compared to investing heavily in one venture benefits: Reduced financial risk, Diversification of investments, Moderate growth potential" } ] }
    return resp