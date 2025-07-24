from pydantic import BaseModel, EmailStr
from datetime import datetime

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    createdAt: datetime = datetime.utcnow()
