from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional

class Diagnosis(BaseModel):
    userId: str
    diagnosis: str
    transcript: str
    audioUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    ttsUrl: Optional[str] = None
    symptom: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
