from datetime import datetime, timedelta
from typing import Optional
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.models.user import User
from app.db import get_db
from bson.objectid import ObjectId

SECRET_KEY = "your_secret_key_here"  # 🔐 Replace with a secure, env-based key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 🔐 Hash and verify password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# 🔐 JWT token creation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# 🔐 JWT token verification
def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# 👤 Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db=Depends(get_db),
):
    token = credentials.credentials
    payload = verify_token(token)
    user_id_str = payload.get("user_id")

    if not user_id_str:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    try:
        user_id_obj = ObjectId(user_id_str)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user ID format")

    user = await db["users"].find_one({"_id": user_id_obj})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# 🛡️ JWTBearer class for route protection
class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials and credentials.scheme == "Bearer":
            verify_token(credentials.credentials)
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid or missing token")
