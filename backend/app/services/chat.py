import json

import httpx
from sqlalchemy.orm import Session

from app.config import DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL
from app.models.user import User
from app.models.chat import ChatMessage


class ChatStreamResult:
    def __init__(self):
        self.full_response = ""


def build_system_prompt(user: User) -> str:
    return (
        f"你叫 StudyPal，是学习助手。当前用户学习数据：\n"
        f"- 连续学习天数：{user.streak_days} 天\n"
        f"- 用户等级：{user.level} 级\n"
        f"基于以上数据给用户提供个性化建议。回答简洁（200 字以内）。"
    )


async def stream_chat(user: User, message: str, result: ChatStreamResult):
    if not DEEPSEEK_API_KEY:
        yield "data: {\"error\": \"AI service not configured\"}\n\n"
        yield "data: [DONE]\n\n"
        return

    system_prompt = build_system_prompt(user)

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        "stream": True,
    }

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream(
            "POST",
            f"{DEEPSEEK_BASE_URL}/chat/completions",
            json=payload,
            headers=headers,
        ) as response:
            if response.status_code != 200:
                yield "data: {\"error\": \"AI service unavailable\"}\n\n"
                yield "data: [DONE]\n\n"
                return

            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str == "[DONE]":
                    break
                try:
                    chunk = json.loads(data_str)
                    delta = chunk.get("choices", [{}])[0].get("delta", {})
                    content = delta.get("content", "")
                    if content:
                        result.full_response += content
                        yield f"data: {json.dumps({'token': content})}\n\n"
                except (json.JSONDecodeError, KeyError, IndexError):
                    continue

    yield "data: [DONE]\n\n"


def save_messages(db: Session, user_id: int, user_message: str, assistant_response: str | None):
    db.add(ChatMessage(user_id=user_id, role="user", content=user_message))
    if assistant_response:
        db.add(ChatMessage(user_id=user_id, role="assistant", content=assistant_response))
    db.commit()


def get_history(db: Session, user_id: int) -> list[ChatMessage]:
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
