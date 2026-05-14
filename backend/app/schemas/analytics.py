from datetime import date, datetime
from pydantic import BaseModel


class OverviewResponse(BaseModel):
    today_hours: float
    active_courses: int
    completion_rate: float
    streak_days: int
    total_hours: float
    total_sessions: int


class CalendarDay(BaseModel):
    date: date
    duration_minutes: int
    level: int  # 0-4


class CalendarResponse(BaseModel):
    year: int
    month: int
    days: list[CalendarDay]


class AchievementItem(BaseModel):
    key: str
    name: str
    description: str
    icon: str
    unlocked: bool
    progress: int
    target: int
    unlocked_at: datetime | None
