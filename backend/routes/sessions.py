import os
import tempfile
import uuid
from datetime import date, datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from database import supabase
from auth import get_current_user_id
from models import SessionOut, SpeakingContext
from services.analysis import analyze

router = APIRouter(prefix="/sessions", tags=["sessions"])

ALLOWED_TYPES = {"video/mp4", "video/quicktime", "video/webm"}
MAX_SIZE = 200 * 1024 * 1024  # 200MB

@router.get("", response_model=List[SessionOut])
async def list_sessions(user_id: str = Depends(get_current_user_id)):
    result = supabase.table("sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data or []

@router.get("/{session_id}", response_model=SessionOut)
async def get_session(session_id: str, user_id: str = Depends(get_current_user_id)):
    session_res = supabase.table("sessions").select("*").eq("id", session_id).eq("user_id", user_id).execute()
    if not session_res.data:
        raise HTTPException(status_code=404, detail="Session not found")
    session = session_res.data[0]

    metrics_res = supabase.table("metric_results").select("*").eq("session_id", session_id).execute()
    transcript_res = supabase.table("transcripts").select("*").eq("session_id", session_id).execute()

    session["metrics"] = metrics_res.data or []
    if transcript_res.data:
        session["transcript"] = transcript_res.data[0]["full_text"]

    return session

@router.post("", response_model=SessionOut, status_code=201)
async def create_session(
    video: UploadFile = File(...),
    context: SpeakingContext = Form(...),
    topic: Optional[str] = Form(default=None),
    user_id: str = Depends(get_current_user_id),
):
    # Validate file type
    if video.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only MP4, MOV, and WebM files are supported")

    # Read and check size
    content = await video.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File must be under 200MB")

    # Save temp file
    suffix = os.path.splitext(video.filename or "upload.mp4")[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Run analysis pipeline
        result = analyze(tmp_path, context.value)

        session_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        today = date.today().isoformat()

        # Upsert session (one per day — overwrite)
        existing = supabase.table("sessions").select("id").eq("user_id", user_id).eq("date", today).execute()
        if existing.data:
            session_id = existing.data[0]["id"]
            supabase.table("sessions").update({
                "context": context.value,
                "topic": topic,
                "duration_seconds": result["duration_seconds"],
                "speakup_score": result["speakup_score"],
            }).eq("id", session_id).execute()
            supabase.table("metric_results").delete().eq("session_id", session_id).execute()
            supabase.table("transcripts").delete().eq("session_id", session_id).execute()
        else:
            supabase.table("sessions").insert({
                "id": session_id,
                "user_id": user_id,
                "date": today,
                "context": context.value,
                "topic": topic,
                "duration_seconds": result["duration_seconds"],
                "speakup_score": result["speakup_score"],
                "created_at": now,
            }).execute()

        # Store metrics
        for m in result["metrics"]:
            supabase.table("metric_results").insert({
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                **m,
            }).execute()

        # Store transcript
        supabase.table("transcripts").insert({
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "full_text": result["transcript"],
            "filler_positions": result["filler_positions"],
        }).execute()

        return SessionOut(
            id=session_id,
            user_id=user_id,
            date=today,
            duration_seconds=result["duration_seconds"],
            context=context,
            topic=topic,
            speakup_score=result["speakup_score"],
            created_at=now,
            metrics=result["metrics"],
            transcript=result["transcript"],
        )
    finally:
        os.remove(tmp_path)
