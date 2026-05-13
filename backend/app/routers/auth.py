from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import SessionLocal
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, RefreshRequest, AccessTokenResponse
from app.models.user import User
from app.services.auth import register, authenticate, refresh_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        or_(User.username == data.username, User.email == data.email)
    ).first()
    if existing:
        if existing.username == data.username:
            raise HTTPException(status_code=409, detail="Username already taken")
        raise HTTPException(status_code=409, detail="Email already registered")
    return register(db, data)


@router.post("/login", response_model=TokenResponse)
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    result = authenticate(db, data.username, data.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token, refresh_token, expires_in = result
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
    )


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh_token(data: RefreshRequest, db: Session = Depends(get_db)):
    token = refresh_access_token(db, data.refresh_token)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    return AccessTokenResponse(access_token=token, expires_in=1800)
