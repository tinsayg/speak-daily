from fastapi import APIRouter, Depends, HTTPException
from database import supabase
from auth import get_current_user_id
from models import WeeklySummaryOut

router = APIRouter(prefix="/summaries", tags=["summaries"])

@router.get("/latest", response_model=WeeklySummaryOut)
async def get_latest_summary(user_id: str = Depends(get_current_user_id)):
    result = (
        supabase.table("weekly_summaries")
        .select("*")
        .eq("user_id", user_id)
        .order("week_start", desc=True)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="No summary found")
    return result.data[0]
