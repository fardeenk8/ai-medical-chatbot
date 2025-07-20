# app/services/tts.py

import os
from gtts import gTTS
import elevenlabs
from elevenlabs.client import ElevenLabs

# Load API key from .env
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")


# gTTS fallback (if ElevenLabs fails or not available)
def synthesize_with_gtts(text: str, output_path: str) -> None:
    tts = gTTS(text=text, lang="en", slow=False)
    tts.save(output_path)


# ElevenLabs TTS
def synthesize_speech(text: str, output_path: str) -> str:
    try:
        client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        audio = client.generate(
            text=text,
            voice="Aria",
            output_format="mp3_22050_32",
            model="eleven_turbo_v2"
        )
        elevenlabs.save(audio, output_path)
        return output_path
    except Exception as e:
        print(f"ElevenLabs error: {e} — falling back to gTTS.")
        synthesize_with_gtts(text, output_path)
        return output_path
