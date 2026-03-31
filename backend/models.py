from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum

class SpeakingContext(str, Enum):
    casual = "casual"
    interview = "interview"
    presentation = "presentation"
    pitch = "pitch"

# Auth models
class SignupRequest(BaseModel):
    display_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    display_name: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Session models
class MetricResult(BaseModel):
    metric: str
    value: float
    score: float
    flag: Optional[str] = None

class SessionOut(BaseModel):
    id: str
    user_id: str
    date: str
    duration_seconds: int
    context: SpeakingContext
    topic: Optional[str] = None
    speakup_score: float
    created_at: str
    metrics: Optional[List[MetricResult]] = None
    transcript: Optional[str] = None

class WeeklySummaryOut(BaseModel):
    id: str
    user_id: str
    week_start: str
    avg_score: float
    most_improved: str
    top_flag: str
    streak_status: int
