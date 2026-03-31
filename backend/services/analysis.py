"""
Rule-based audio analysis pipeline.
Steps: extract audio → transcribe → compute 5 metrics → score
"""

import os
import re
import subprocess
import tempfile
from typing import Optional
import librosa
import textstat
import openai
from config import settings

openai.api_key = settings.openai_api_key

FILLER_WORDS = ["um", "uh", "like", "you know", "so", "basically", "right", "actually", "literally"]

# ── Weights per context ──────────────────────────────────────────────────────
CONTEXT_WEIGHTS = {
    "casual":       {"pace": 0.20, "fillers": 0.25, "clarity": 0.20, "tone": 0.20, "structure": 0.15},
    "interview":    {"pace": 0.20, "fillers": 0.20, "clarity": 0.25, "tone": 0.20, "structure": 0.15},
    "presentation": {"pace": 0.15, "fillers": 0.20, "clarity": 0.20, "tone": 0.15, "structure": 0.30},
    "pitch":        {"pace": 0.20, "fillers": 0.15, "clarity": 0.25, "tone": 0.15, "structure": 0.25},
}

def extract_audio(video_path: str) -> str:
    """Extract audio WAV from video using ffmpeg."""
    audio_path = video_path.replace(".mp4", ".wav").replace(".mov", ".wav").replace(".webm", ".wav")
    subprocess.run(
        ["ffmpeg", "-i", video_path, "-ac", "1", "-ar", "16000", "-y", audio_path],
        check=True, capture_output=True,
    )
    return audio_path

def transcribe(audio_path: str) -> str:
    """Transcribe audio with Whisper API."""
    with open(audio_path, "rb") as f:
        result = openai.audio.transcriptions.create(model="whisper-1", file=f)
    return result.text

def get_duration(audio_path: str) -> float:
    y, sr = librosa.load(audio_path, sr=None)
    return librosa.get_duration(y=y, sr=sr)

# ── Metric computations ───────────────────────────────────────────────────────

def compute_pace(transcript: str, duration_sec: float) -> dict:
    words = len(transcript.split())
    wpm = round((words / duration_sec) * 60, 1)
    if wpm < 120:
        score, flag = 5.0, "Too slow — aim for 120–180 WPM"
    elif wpm > 180:
        score, flag = 5.0, "Too fast — aim for 120–180 WPM"
    else:
        score, flag = 9.0, None
    return {"metric": "pace", "value": wpm, "score": score, "flag": flag}

def compute_fillers(transcript: str, duration_sec: float) -> dict:
    text_lower = transcript.lower()
    count = sum(
        len(re.findall(rf"\b{re.escape(fw)}\b", text_lower))
        for fw in FILLER_WORDS
    )
    rate = round(count / (duration_sec / 60), 2)
    if rate > 10:
        score, flag = 2.0, f"High filler usage ({rate}/min)"
    elif rate > 5:
        score, flag = 5.0, f"Moderate filler usage ({rate}/min)"
    else:
        score, flag = 9.0, None
    return {"metric": "fillers", "value": rate, "score": score, "flag": flag}

def compute_clarity(transcript: str) -> dict:
    fk = textstat.flesch_kincaid_grade(transcript)
    vocab = len(set(transcript.lower().split())) / max(len(transcript.split()), 1)
    # Normalise: grade level 6–12 is ideal; vocab diversity 0.4–0.7 is good
    grade_score = max(0, 10 - abs(fk - 9))
    vocab_score = min(10, vocab * 15)
    score = round((grade_score + vocab_score) / 2, 1)
    flag = "Message may be hard to follow" if score < 5 else None
    return {"metric": "clarity", "value": round(score, 1), "score": score, "flag": flag}

def compute_tone(transcript: str) -> dict:
    """Lightweight sentiment: count positive vs hesitant words."""
    positive_words = ["confident", "clear", "great", "excellent", "strong", "definitely", "absolutely", "certainly", "believe", "achieve"]
    hesitant_words = ["maybe", "perhaps", "might", "sort of", "kind of", "i guess", "i think", "not sure", "probably", "hopefully"]
    text_lower = transcript.lower()
    pos = sum(text_lower.count(w) for w in positive_words)
    hes = sum(text_lower.count(w) for w in hesitant_words)
    total = pos + hes or 1
    ratio = pos / total
    score = round(min(10, ratio * 10 + 5), 1)
    if score < 5:
        label, flag = "Hesitant", "Low confidence tone detected"
    elif score < 7:
        label, flag = "Neutral", None
    else:
        label, flag = "Confident", None
    return {"metric": "tone", "value": score, "score": score, "flag": flag}

def compute_structure(transcript: str) -> dict:
    """Detect intro and close via keyword heuristics."""
    text_lower = transcript.lower()
    sentences = [s.strip() for s in re.split(r"[.!?]", text_lower) if s.strip()]
    first_three = " ".join(sentences[:3]) if sentences else ""
    last_three  = " ".join(sentences[-3:]) if sentences else ""

    has_intro = any(w in first_three for w in ["hi", "hello", "today", "i'm", "i am", "my name", "let me", "i'd like"])
    has_close = any(w in last_three for w in ["thank", "conclusion", "summary", "to sum", "in closing", "that's all", "wrap up", "questions"])

    if has_intro and has_close:
        score, flag = 9.0, None
    elif has_intro or has_close:
        score, flag = 6.0, "No clear closing detected" if has_intro else "No clear opening detected"
    else:
        score, flag = 3.0, "No clear opening or closing detected"
    return {"metric": "structure", "value": score, "score": score, "flag": flag}

# ── SpeakUp Score ─────────────────────────────────────────────────────────────

def compute_speakup_score(metrics: list[dict], context: str) -> float:
    weights = CONTEXT_WEIGHTS.get(context, CONTEXT_WEIGHTS["casual"])
    metric_map = {m["metric"]: m["score"] for m in metrics}
    score = (
        metric_map.get("pace", 5) * weights["pace"] * 10
        + metric_map.get("fillers", 5) * weights["fillers"] * 10
        + metric_map.get("clarity", 5) * weights["clarity"] * 10
        + metric_map.get("tone", 5) * weights["tone"] * 10
        + metric_map.get("structure", 5) * weights["structure"] * 10
    )
    return round(min(100, max(0, score)), 1)

# ── Main pipeline ─────────────────────────────────────────────────────────────

def analyze(video_path: str, context: str = "casual") -> dict:
    audio_path = extract_audio(video_path)
    try:
        transcript = transcribe(audio_path)
        duration = get_duration(audio_path)
        metrics = [
            compute_pace(transcript, duration),
            compute_fillers(transcript, duration),
            compute_clarity(transcript),
            compute_tone(transcript),
            compute_structure(transcript),
        ]
        speakup_score = compute_speakup_score(metrics, context)
        filler_positions = [
            m.start()
            for fw in FILLER_WORDS
            for m in re.finditer(rf"\b{re.escape(fw)}\b", transcript.lower())
        ]
        return {
            "transcript": transcript,
            "duration_seconds": int(duration),
            "metrics": metrics,
            "speakup_score": speakup_score,
            "filler_positions": sorted(filler_positions),
        }
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)
