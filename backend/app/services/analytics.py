import calendar
import json
from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.analytics import LearningSession, Achievement, UserAchievement


def _compute_level(minutes: int) -> int:
    if minutes <= 0:
        return 0
    if minutes <= 30:
        return 1
    if minutes <= 60:
        return 2
    if minutes <= 120:
        return 3
    return 4


def _compute_streak(db: Session, user_id: int) -> int:
    today = date.today()
    sessions = (
        db.query(LearningSession.session_date)
        .filter(LearningSession.user_id == user_id)
        .distinct()
        .order_by(LearningSession.session_date.desc())
        .all()
    )
    if not sessions or sessions[0][0] < today - timedelta(days=1):
        return 0
    streak = 1
    for i in range(1, len(sessions)):
        prev = sessions[i - 1][0]
        curr = sessions[i][0]
        if (prev - curr) == timedelta(days=1):
            streak += 1
        else:
            break
    return streak


def get_overview(db: Session, user: User) -> dict:
    today = date.today()
    user_id = user.id

    today_minutes = (
        db.query(func.coalesce(func.sum(LearningSession.duration_minutes), 0))
        .filter(LearningSession.user_id == user_id, LearningSession.session_date == today)
        .scalar()
    )
    total_minutes = (
        db.query(func.coalesce(func.sum(LearningSession.duration_minutes), 0))
        .filter(LearningSession.user_id == user_id)
        .scalar()
    )
    total_sessions = (
        db.query(func.count(LearningSession.id))
        .filter(LearningSession.user_id == user_id)
        .scalar()
    )
    distinct_courses = (
        db.query(func.count(func.distinct(LearningSession.course_name)))
        .filter(LearningSession.user_id == user_id, LearningSession.course_name.isnot(None))
        .scalar()
    )
    streak = _compute_streak(db, user_id)

    return {
        "today_hours": round(today_minutes / 60.0, 1),
        "active_courses": max(distinct_courses or 0, 1),
        "completion_rate": 0.0,
        "streak_days": streak,
        "total_hours": round(total_minutes / 60.0, 1),
        "total_sessions": total_sessions or 0,
    }


def get_calendar_data(db: Session, user_id: int, year: int, month: int) -> dict:
    _, days_in_month = calendar.monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, days_in_month)

    rows = (
        db.query(LearningSession.session_date, func.sum(LearningSession.duration_minutes))
        .filter(
            LearningSession.user_id == user_id,
            LearningSession.session_date >= start_date,
            LearningSession.session_date <= end_date,
        )
        .group_by(LearningSession.session_date)
        .all()
    )
    daily_map = {row[0]: row[1] for row in rows}

    days = []
    for day in range(1, days_in_month + 1):
        d = date(year, month, day)
        minutes = daily_map.get(d, 0)
        days.append({
            "date": d,
            "duration_minutes": minutes,
            "level": _compute_level(minutes),
        })

    return {"year": year, "month": month, "days": days}


def get_achievements(db: Session, user_id: int) -> dict:
    all_achievements = db.query(Achievement).all()
    user_achs = {
        ua.achievement_id: ua
        for ua in db.query(UserAchievement)
        .filter(UserAchievement.user_id == user_id)
        .all()
    }

    today = date.today()

    items = []
    for ach in all_achievements:
        criteria = json.loads(ach.criteria_json)
        criteria_type = criteria["type"]
        target = criteria["target"]

        if criteria_type == "total_sessions":
            progress = (
                db.query(func.count(LearningSession.id))
                .filter(LearningSession.user_id == user_id)
                .scalar()
            ) or 0
        elif criteria_type == "streak_days":
            progress = _compute_streak(db, user_id)
        elif criteria_type == "total_hours":
            total_min = (
                db.query(func.coalesce(func.sum(LearningSession.duration_minutes), 0))
                .filter(LearningSession.user_id == user_id)
                .scalar()
            ) or 0
            progress = round(total_min / 60.0, 1)
        else:
            progress = 0

        ua = user_achs.get(ach.id)
        unlocked = ua is not None and ua.unlocked_at is not None

        # Update or create user_achievement row if progress changed
        if progress >= target and (ua is None or ua.unlocked_at is None):
            if ua is None:
                ua = UserAchievement(user_id=user_id, achievement_id=ach.id, progress=int(progress), target=target, unlocked_at=func.now())
                db.add(ua)
            else:
                ua.progress = int(progress)
                ua.unlocked_at = func.now()
            db.commit()
            unlocked = True
        elif ua is not None and ua.progress != int(progress):
            ua.progress = int(progress)
            db.commit()

        items.append({
            "key": ach.key,
            "name": ach.name,
            "description": ach.description,
            "icon": ach.icon,
            "unlocked": unlocked,
            "progress": int(progress) if isinstance(progress, (int, float)) else 0,
            "target": target,
            "unlocked_at": ua.unlocked_at if ua else None,
        })

    return {"achievements": items}
