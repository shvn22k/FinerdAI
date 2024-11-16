from dataclasses import Field
from typing import Literal, Optional, List, Any, Dict
from pydantic import BaseModel, conint, validator, confloat, Field


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    location: Optional[str] = None
    country_code: Optional[str] = None


class UpdateUser(BaseModel):
    email: Optional[str] = None
    location: Optional[str] = None
    country_code: Optional[str] = None


class CreateUserRequest(BaseModel):
    username: str
    password: str
    email: str
    first_name: str
    last_name: str
    location: str
    country_code: str
    gender: Literal['male', 'female']


class OpenAIData(BaseModel):
    data1: dict


class UserData(BaseModel):
    email: str
    username: str
    first_name: str
    last_name: str
    gender: Literal['male', 'female']
    location: str
    country_code: str

class MFAdvisor(BaseModel):
    fund_name: str

class Blog(BaseModel):
    blog_title : str
    blog_content : Optional[str]

class QuestionRequest(BaseModel):
    question: str

class LoanApplication(BaseModel):
    no_of_dependents: int = Field(..., ge=0, le=10, description="Number of dependents")
    education: str = Field(..., pattern="^( Not Graduate| Graduate)$", description="Educational status")
    self_employed: str = Field(..., pattern="^( Yes| No)$", description="Employment status indicating self-employment")
    income_annum: float = Field(..., ge=10000, description="Annual income of the applicant")
    loan_amount: float = Field(..., ge=10000, description="Requested loan amount")
    loan_term: int = Field(..., ge=1, description="Loan term in months")
    cibil_score: int = Field(..., ge=300, le=850, description="Credit or CIBIL score")
    residential_assets_value: float = Field(..., ge=1000000, description="Value of residential assets")
    commercial_assets_value: float = Field(..., ge=1000000, description="Value of commercial assets")
    luxury_assets_value: float = Field(..., ge=1000000, description="Value of luxury assets")
    bank_asset_value: float = Field(..., ge=1000000, description="Value of bank assets")


class UserProfile(BaseModel):
    name: Optional[str]
    maritialStatus: Optional[str]
    age: Optional[int]
    occupation: Optional[str]
    annual_income: Optional[int]
    financial_goals: Optional[List[str]]


class ScenarioResponse(BaseModel):
    title: str
    description: str
    choices: List[str]
    learning_points: Optional[List[str]]
    consequences: Optional[List[Dict[str, str]]]

class financial_health_profile(BaseModel):
    monthly_income : int
    monthly_expenses : int
    total_debt : int
    total_savings : int
    total_investments : int