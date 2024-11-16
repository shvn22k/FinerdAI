from __future__ import annotations

import os
from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from models import CreateUserRequest, Token
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from database import Database
from dotenv import load_dotenv

router = APIRouter(
    prefix='/authenticate',
    tags=['authenticate']
)

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="authenticate/token")


def generate_payload(username: str, expiration: timedelta | None = None):
    if expiration is None:
        expiration = timedelta(hours=1)
    payload = {
        "username": username,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + expiration
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def token_verifier(token: str = Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('username')
        if username is None:
            raise HTTPException(status_code=403, detail="Token is Invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is Invalid or expired")  # hey


@router.post('/register', status_code=status.HTTP_201_CREATED)
async def create_user(create_user: CreateUserRequest):
    check = Database.check_user(create_user.username, create_user.email)
    if check:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Username already exists')

    query = "insert into Users (username, email, hashed_password) values (%s, %s, %s)"
    hashed_password = bcrypt_context.hash(create_user.password)
    Database.execute_query(query, (create_user.username, create_user.email, hashed_password))
    try:
        os.mkdir(f"\\\\delvanonas.local\\pi-nasty\\{create_user.username}")
    except FileExistsError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Username already exists')
    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail='Unable to create user')

    try:
        query = "insert into user_data (username, first_name, last_name, sex, location, country_code) values (%s, %s, %s, %s, %s, %s)"
        params = (
            create_user.username, create_user.first_name, create_user.last_name,
            create_user.gender, create_user.location, create_user.country_code
        )
        print(query, params)
        Database.execute_query(query, params)
    except RuntimeError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Data Not Valid')

    token = generate_payload(username=create_user.username, expiration=timedelta(hours=1, minutes=40))
    return {"access_token": token, "token_type": "Bearer"}


@router.post('/login', response_model=Token, status_code=status.HTTP_200_OK)
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    hashed_pass = Database.get_user_pass(username=form_data.username)

    if not hashed_pass:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect username or password')
    elif not bcrypt_context.verify(form_data.password, hashed_pass[0]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect username or password')

    token = generate_payload(username=form_data.username, expiration=timedelta(hours=1, minutes=40))
    return {"access_token": token, "token_type": "Bearer"}


@router.get("/verify/token", status_code=status.HTTP_200_OK)
async def verify_token(token: str = Depends(oauth2_bearer)):
    token_verifier(token=token)
    return {"message": "token is valid"}
