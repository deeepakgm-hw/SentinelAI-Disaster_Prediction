from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from db.sqlite_database import get_db
from db.models import User, ChatMessage
from services.auth_service import get_current_user
from services.chat_service import process_chat_message

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatMessageRequest(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str

@router.get("/history", response_model=List[ChatMessageResponse])
async def get_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.timestamp.asc()).all()
    return [
        ChatMessageResponse(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            timestamp=msg.timestamp.isoformat()
        ) for msg in messages
    ]

@router.post("/send", response_model=ChatMessageResponse)
async def send_chat_message(req: ChatMessageRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Save User Message
    user_msg = ChatMessage(user_id=current_user.id, role="user", content=req.message)
    db.add(user_msg)
    db.commit()
    
    # 2. Get AI Response
    ai_content = await process_chat_message(req.message)
    
    # 3. Save AI Message
    ai_msg = ChatMessage(user_id=current_user.id, role="ai", content=ai_content)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    return ChatMessageResponse(
        id=ai_msg.id,
        role=ai_msg.role,
        content=ai_msg.content,
        timestamp=ai_msg.timestamp.isoformat()
    )

@router.delete("/clear")
async def clear_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).delete()
    db.commit()
    return {"success": True, "message": "Chat history cleared."}
