import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from starlette import status
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from markdownify import markdownify
import chatbot
import finance_simulator
from models import LoanApplication, Blog
import pickle
import requests
import pandas as pd
from datetime import datetime
import numpy as np
from auth import token_verifier, oauth2_bearer
from podcastgen import generate_podcast

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(auth.router)
app.include_router(chatbot.router)
app.include_router(finance_simulator.router)

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

loan_model = pickle.load(open('american-loan-approval.pkl', 'rb'))


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.post("/loanapproval", status_code=status.HTTP_200_OK)
async def loan_approval_prediction(loan_approval: LoanApplication):
    #token_verifier(token=token)
    loan_data = {
        ' no_of_dependents': loan_approval.no_of_dependents,
        ' education': loan_approval.education,
        ' self_employed': loan_approval.self_employed,
        ' income_annum': loan_approval.income_annum,
        ' loan_amount': loan_approval.loan_amount,
        ' loan_term': loan_approval.loan_term,
        ' cibil_score': loan_approval.cibil_score,
        ' residential_assets_value': loan_approval.residential_assets_value,
        ' commercial_assets_value': loan_approval.commercial_assets_value,
        ' luxury_assets_value': loan_approval.luxury_assets_value,
        ' bank_asset_value': loan_approval.bank_asset_value
    }
    input_data = pd.DataFrame([loan_data])
    prediction = loan_model.predict(input_data)[0]
    if prediction == 1:
        prediction = 'High chances of Loan Approval.'
    else:
        prediction = 'Low chances of Loan Approval.'
    return {"approval": prediction}


@app.post("/blogpost", status_code=status.HTTP_201_CREATED)
async def blog_post(blog_obj: Blog):
    #payload=token_verifier(token=token)
    #username=payload.get("username")
    rel_path=f".\\{blog_obj.blog_title}.html" #change path here
    file_obj_blog=open(rel_path,'w')
    file_obj_blog.write(blog_obj.blog_content)
    generate_podcast(blog_obj.title, markdownify(blog_obj.blog_content), store_to=f".\\")
    return{"message": "Created podcast and blog"}


@app.get("/funds")
async def get_available_funds():
    url = 'https://api.mfapi.in/mf'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        available_funds = pd.DataFrame(data)
        fund_list = available_funds[['schemeCode', 'schemeName']].to_dict(orient="records")
        return JSONResponse(content={"funds": fund_list})
    else:
        raise HTTPException(status_code=response.status_code, detail="Error fetching funds")


# Endpoint to get historical NAV data for a specific fund
@app.get("/funds/{scheme_code}/nav-history")
async def get_fund_nav_history(scheme_code: str):
    scheme_data_url = f"https://api.mfapi.in/mf/{scheme_code}"
    response = requests.get(scheme_data_url)

    if response.status_code == 200:
        hist_data = response.json()
        df = pd.DataFrame(hist_data['data'], columns=['date', 'nav'])
        df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
        df['nav'] = pd.to_numeric(df['nav'])

        # Calculate trend line
        x = np.arange(len(df['nav']))
        z = np.polyfit(x, df['nav'], 1)
        p = np.poly1d(z)
        trend_line = p(x).tolist()

        # Prepare data for JSON response
        nav_history = {
            "dates": df['date'].dt.strftime('%Y-%m-%d').tolist(),
            "navs": df['nav'].tolist(),
            "trend_line": trend_line
        }

        return JSONResponse(content=nav_history)
    else:
        raise HTTPException(status_code=response.status_code, detail="Error fetching NAV history")
