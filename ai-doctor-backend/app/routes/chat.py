from fastapi import APIRouter, UploadFile, File, Form
from app.services.stt import transcribe_audio
from app.services.vision import analyze_image
from app.services.tts import synthesize_speech
from app.db import db
from app.models.diagnosis import Diagnosis
import uuid, os, shutil

router = APIRouter()

UPLOADS_DIR = "uploads"
API_BASE_URL = os.environ.get("API_BASE_URL")

@router.post("/chat")
async def chat(audio: UploadFile = File(...), image: UploadFile = File(None), symptom: str = Form(None), frontendId: str = Form(...)):
    os.makedirs(UPLOADS_DIR, exist_ok=True)

    # Save audio permanently
    audio_filename = f"{uuid.uuid4()}-{audio.filename}"
    audio_path = os.path.join(UPLOADS_DIR, audio_filename)
    with open(audio_path, "wb") as f:
        shutil.copyfileobj(audio.file, f)
    audio_url = f"{API_BASE_URL}/uploads/{audio_filename}"

    # Save image permanently
    image_path = None
    image_url = None
    if image:
        image_filename = f"{uuid.uuid4()}-{image.filename}"
        image_path = os.path.join(UPLOADS_DIR, image_filename)
        with open(image_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"{API_BASE_URL}/uploads/{image_filename}"

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
    if symptom:
        system_prompt += f" The user has also indicated a primary symptom of: {symptom}. Please take this into account."
    query = system_prompt + transcript

    # 3. Diagnose image
    if image_path:
        diagnosis = analyze_image(query, image_path)
    else:
        diagnosis = "No image provided for me to analyze."

    # 4. TTS Response
    voice_path = f"temp/{uuid.uuid4()}.mp3"
    synthesize_speech(diagnosis, output_path=voice_path)

    # 5. Save to MongoDB
    record = Diagnosis(
        userId="anonymous",
        diagnosis=diagnosis,
        transcript=transcript,
        audioUrl=audio_url,
        imageUrl=image_url,
        ttsUrl=f"{API_BASE_URL}/temp/{os.path.basename(voice_path)}",
        symptom=symptom,
        frontendId=frontendId
    )
    await db.diagnoses.insert_one(record.model_dump())

    return {
        "transcript": transcript,
        "diagnosis": diagnosis,
        "voice_url": f"{API_BASE_URL}/temp/{os.path.basename(voice_path)}",
        "image_url": image_url,
        "audio_url": audio_url
    }
