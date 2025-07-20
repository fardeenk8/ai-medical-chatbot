# app/services/stt.py
from dotenv import load_dotenv
load_dotenv()

import os
from groq import Groq

# Extracted from .env
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
MODEL_NAME = "whisper-large-v3"

def transcribe_audio(audio_path: str) -> str:
    client = Groq(api_key=GROQ_API_KEY)

    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model=MODEL_NAME,
            file=audio_file,
            language="en"
        )

    return transcription.text
