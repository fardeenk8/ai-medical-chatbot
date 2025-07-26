# app/main.py

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.responses import FileResponse
from app.routes import chat, auth, diagnosis, pdf

from gtts import gTTS
import uuid
import os
import tempfile

# Create FastAPI app instance
app = FastAPI()

# Allow frontend access (temp: allow all)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/temp", StaticFiles(directory="temp"), name="temp")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")



# TTS endpoint
class TTSRequest(BaseModel):
    text: str

@app.post("/api/tts")
async def generate_tts(data: TTSRequest):
    text = data.text
    tts = gTTS(text)

    temp_dir = tempfile.gettempdir()
    filename = f"{uuid.uuid4()}.mp3"
    path = os.path.join(temp_dir, filename)

    tts.save(path)
    return FileResponse(path, media_type="audio/mpeg", filename=filename)

# Include chat router
app.include_router(chat.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(diagnosis.router)
app.include_router(pdf.router)