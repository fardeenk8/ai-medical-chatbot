# app/db.py
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends
from config import MONGO_URI
from bson.objectid import ObjectId

client = AsyncIOMotorClient(MONGO_URI)
db = client.ai_doctor  # database name

def get_db():
    return db

async def get_diagnosis_by_id(diagnosis_id: str):
    return await db.diagnoses.find_one({"frontendId": diagnosis_id})