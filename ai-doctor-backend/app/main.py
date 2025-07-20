# app/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat
from fastapi.staticfiles import StaticFiles




app = FastAPI()

# Allow frontend access (temp: allow all)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/temp", StaticFiles(directory="temp"), name="temp")

app.include_router(chat.router)
