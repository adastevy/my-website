from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.user import User, RefreshToken
from app.schemas.user import UserCreate
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.config import REFRESH_TOKEN_EXPIRE_DAYS


def register(db: Session, data: UserCreate) -> User:
    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_username_or_email(db: Session, login: str) -> User | None:
    return db.query(User).filter(
        or_(User.username == login, User.email == login)
    ).first()


def authenticate(db: Session, login: str, password: str) -> tuple[str, str, int] | None:
    user = get_user_by_username_or_email(db, login)
    if not user or not verify_password(password, user.password_hash):
        return None

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=expires_at,
    )
    db.add(db_token)
    db.commit()

    return access_token, refresh_token, 1800


def refresh_access_token(db: Session, token_str: str) -> str | None:
    try:
        payload = decode_token(token_str)
    except Exception:
        return None

    if payload.get("type") != "refresh":
        return None

    stored = db.query(RefreshToken).filter(
        RefreshToken.token == token_str,
        RefreshToken.revoked == False,
    ).first()

    if not stored:
        return None

    if stored.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return None

    return create_access_token(stored.user_id)
