# app/routes/chat.py
from fastapi import APIRouter, UploadFile, File
from app.services.stt import transcribe_audio
from app.services.vision import analyze_image
from app.services.tts import synthesize_speech
import uuid, os, shutil

router = APIRouter()

@router.post("/api/chat")
async def chat(audio: UploadFile = File(...), image: UploadFile = File(None)):
    # Save audio
    audio_path = f"temp/{uuid.uuid4()}-{audio.filename}"
    with open(audio_path, "wb") as f:
        shutil.copyfileobj(audio.file, f)

    # Save image
    image_path = None
    if image:
        image_path = f"temp/{uuid.uuid4()}-{image.filename}"
        with open(image_path, "wb") as f:
            shutil.copyfileobj(image.file, f)

    # 1. Transcribe speech
    transcript = transcribe_audio(audio_path)

    # 2. Generate prompt
    system_prompt = """You have to act as a professional doctor, i know you are not but this is for learning purpose. 
        What's in this image?. Do you find anything wrong with it medically? 
        If you make a differential, suggest some remedies for them. Donot add any numbers or special characters in 
        your response. Your response should be in one long paragraph. Also always answer as if you are answering to a real person.
        Donot say 'In the image I see' but say 'With what I see and hear, I think you have ....'
        Dont respond as an AI model in markdown, your answer should mimic that of an actual doctor not an AI bot, 
        Keep your answer concise (max 2 sentences). No preamble, start your answer right away please"""
    query = system_prompt + transcript

    # 3. Diagnose image
    if image_path:
        diagnosis = analyze_image(query, image_path)
    else:
        diagnosis = "No image provided for me to analyze."

    # 4. TTS Response
    voice_path = f"temp/{uuid.uuid4()}.mp3"  # <-- this line was missing
    voice_file = synthesize_speech(diagnosis, output_path=voice_path)

    return {
        "transcript": transcript,
        "diagnosis": diagnosis,
        "voice_url": f"http://localhost:8000/{voice_path}"
    }
