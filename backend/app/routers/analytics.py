from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.analytics import OverviewResponse, CalendarResponse, CalendarDay, AchievementItem
from app.services.analytics import get_overview, get_calendar_data, get_achievements
from app.utils.deps import get_current_user, get_db

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/overview", response_model=OverviewResponse)
def overview(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_overview(db, current_user)


@router.get("/calendar", response_model=CalendarResponse)
def calendar_data(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_calendar_data(db, current_user.id, year, month)


@router.get("/achievements")
def achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_achievements(db, current_user.id)
