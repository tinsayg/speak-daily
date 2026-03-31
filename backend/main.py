from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import auth, sessions, summaries

app = FastAPI(
    title="SpeakUp API",
    description="Daily speaking coach — rule-based audio analysis backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(summaries.router)

@app.get("/health")
def health():
    return {"status": "ok"}
