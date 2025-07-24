from fastapi import APIRouter, HTTPException, Depends
from passlib.hash import bcrypt
from pydantic import BaseModel, EmailStr
from app.models.user import User
from app.utils.auth import create_access_token
from app.db import db

router = APIRouter()

class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup(data: SignupModel):
    users = db.users
    if await users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    hashed_pw = bcrypt.hash(data.password)
    new_user = {"name": data.name, "email": data.email, "password": hashed_pw}
    result = await users.insert_one(new_user)
    
    token = create_access_token({"user_id": str(result.inserted_id)})
    return {"message": "Signup successful", "token": token}

@router.post("/login")
async def login(data: LoginModel):
    print(f"DEBUG: Login attempt for email: {data.email}")
    users = db.users
    user = await users.find_one({"email": data.email})
    
    if not user:
        print(f"DEBUG: User with email {data.email} not found.")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    print(f"DEBUG: User found. Hashed password from DB: {user['password']}")
    password_match = bcrypt.verify(data.password, user["password"])
    print(f"DEBUG: Password verification result: {password_match}")

    if not password_match:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"user_id": str(user["_id"])})
    return {"message": "Login successful", "token": token}
