from fastapi import APIRouter, HTTPException, Response, Depends, status
from fastapi.responses import JSONResponse
from database import supabase
from models import SignupRequest, LoginRequest, TokenResponse, UserOut
from auth import hash_password, verify_password, create_token, get_current_user_id
from config import settings
import uuid
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_OPTS = dict(
    key="speakup_token",
    httponly=True,
    secure=False,        # set True in production (HTTPS)
    samesite="lax",
    max_age=60 * 60 * 24 * settings.jwt_expire_days,
    path="/",
)

@router.post("/signup", response_model=TokenResponse)
async def signup(body: SignupRequest, response: Response):
    # Check if email already exists
    existing = supabase.table("users").select("id").eq("email", body.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already in use")

    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    user_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    supabase.table("users").insert({
        "id": user_id,
        "email": body.email,
        "display_name": body.display_name,
        "password_hash": hash_password(body.password),
        "created_at": now,
    }).execute()

    token = create_token(user_id)
    response.set_cookie(**COOKIE_OPTS, value=token)

    return TokenResponse(
        access_token=token,
        user=UserOut(id=user_id, email=body.email, display_name=body.display_name, created_at=now),
    )

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, response: Response):
    result = supabase.table("users").select("*").eq("email", body.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = result.data[0]
    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(user["id"])
    response.set_cookie(**COOKIE_OPTS, value=token)

    return TokenResponse(
        access_token=token,
        user=UserOut(id=user["id"], email=user["email"], display_name=user["display_name"], created_at=user["created_at"]),
    )

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("speakup_token", path="/")
    return {"message": "Logged out"}

@router.get("/me", response_model=UserOut)
async def me(user_id: str = Depends(get_current_user_id)):
    result = supabase.table("users").select("*").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    u = result.data[0]
    return UserOut(id=u["id"], email=u["email"], display_name=u["display_name"], created_at=u["created_at"])
