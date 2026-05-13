from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatHistoryResponse
from app.services.chat import stream_chat, save_messages, get_history, ChatStreamResult
from app.utils.deps import get_current_user, get_db

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("")
async def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    async def event_generator():
        result = ChatStreamResult()
        async for event in stream_chat(current_user, request.message, result):
            yield event
        db = SessionLocal()
        try:
            save_messages(db, current_user.id, request.message, result.full_response or None)
        finally:
            db.close()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/history", response_model=ChatHistoryResponse)
def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages = get_history(db, current_user.id)
    return ChatHistoryResponse(
        messages=[
            {"id": m.id, "role": m.role, "content": m.content, "created_at": m.created_at}
            for m in messages
        ]
    )
